import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe/server';
import { createServiceClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/emails/send';
import { trialStartedEmail, subscriptionCancelledEmail } from '@/lib/emails/templates';

export const runtime = 'nodejs';

function tsToIso(seconds: number | null | undefined): string | null {
  if (!seconds) return null;
  return new Date(seconds * 1000).toISOString();
}

async function upsertFromSubscription(sub: Stripe.Subscription) {
  const admin = createServiceClient();
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;

  const { data: existing } = await admin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();

  if (!existing?.user_id) {
    console.warn('[stripe/webhook] no subscriptions row for customer', customerId);
    return;
  }

  const item = sub.items.data[0];
  await admin.from('subscriptions').upsert(
    {
      user_id: existing.user_id,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      status: sub.status,
      price_id: item?.price.id ?? null,
      current_period_end: tsToIso(item?.current_period_end ?? null),
      cancel_at_period_end: sub.cancel_at_period_end,
      trial_end: tsToIso(sub.trial_end),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
}

async function customerEmail(customer: string | Stripe.Customer | Stripe.DeletedCustomer): Promise<string | null> {
  const stripe = getStripe();
  const id = typeof customer === 'string' ? customer : customer.id;
  try {
    const c = await stripe.customers.retrieve(id);
    if (c.deleted) return null;
    return c.email ?? null;
  } catch {
    return null;
  }
}

async function safeSend(to: string | null, content: { subject: string; html: string }) {
  if (!to) return;
  try {
    await sendEmail({ to, ...content });
  } catch (err) {
    console.error('[stripe/webhook] email send failed', err);
  }
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 });
  }

  const sig = request.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[stripe/webhook] signature verification failed', message);
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription' && session.subscription) {
          const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertFromSubscription(sub);
          const to = session.customer_details?.email ?? (await customerEmail(sub.customer));
          await safeSend(to, trialStartedEmail({ trialEnd: tsToIso(sub.trial_end) }));
        }
        break;
      }
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription;
        await upsertFromSubscription(sub);
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const previous = (event.data as { previous_attributes?: Partial<Stripe.Subscription> }).previous_attributes;
        await upsertFromSubscription(sub);
        const wasCancelled = previous?.cancel_at_period_end === false && sub.cancel_at_period_end === true;
        if (wasCancelled) {
          const item = sub.items.data[0];
          const accessUntil = tsToIso(item?.current_period_end ?? null);
          const to = await customerEmail(sub.customer);
          await safeSend(to, subscriptionCancelledEmail({ accessUntil }));
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await upsertFromSubscription(sub);
        const item = sub.items.data[0];
        const periodEnd = tsToIso(item?.current_period_end ?? null);
        const accessUntil = periodEnd && new Date(periodEnd).getTime() > Date.now() ? periodEnd : null;
        const to = await customerEmail(sub.customer);
        await safeSend(to, subscriptionCancelledEmail({ accessUntil }));
        break;
      }
      default:
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[stripe/webhook] handler error', err);
    return NextResponse.json({ error: 'Webhook handler failed.' }, { status: 500 });
  }
}
