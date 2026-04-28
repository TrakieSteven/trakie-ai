# Stripe — switching from sandbox to production

When you're ready to start charging real customers, swap Stripe from test mode to live mode. Nothing in the code changes — it's all env-var swaps plus a couple of Stripe dashboard steps.

---

## 1. In Stripe (toggle Test mode OFF)

- **Recreate the Product + Price** ($499/mo). Test-mode and live-mode objects are completely separate. Copy the new live `price_…` ID.
- **Add a webhook endpoint**: Developers → Webhooks → Add endpoint
  - URL: `https://trakie.ai/api/stripe/webhook`
  - Events to send:
    - `checkout.session.completed`
    - `customer.subscription.created`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
  - After creating, click into it and copy the **Signing secret** (`whsec_…`) — this is different from the local Stripe CLI secret.
- **Activate live API keys** if not already (Developers → API keys, with Test mode OFF). Copy `sk_live_…` and `pk_live_…`.
- **Customer Portal**: Settings → Billing → Customer portal → confirm features (cancel, update card, view invoices) are toggled on for live mode too. Test-mode portal config does **not** carry over.

---

## 2. In Vercel (production env)

Project → Settings → Environment Variables, set for **Production** only (leave Preview/Development on test keys):

```
STRIPE_SECRET_KEY=sk_live_…
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_…
STRIPE_WEBHOOK_SECRET=whsec_…       ← from the live webhook endpoint, NOT the CLI
STRIPE_PRICE_ID=price_…             ← live-mode price
SUPABASE_SERVICE_ROLE_KEY=eyJ…      ← unchanged
```

Then redeploy (or trigger a new deploy — env-var changes don't apply to existing deployments).

---

## 3. Database housekeeping

The `subscriptions` table holds **test customer/sub IDs** from any signups done during testing. Before going live, run in the Supabase SQL editor:

```sql
delete from public.subscriptions;
```

Otherwise live webhooks for an existing test customer ID will silently fail to match a row. (You can also keep them and let new live customers create fresh rows, but cleaning is safer.)

---

## 4. Smoke test on production

- Open `trakie.ai/pricing` while logged in → click the trial CTA → real card. The charge will be authorized but not captured for 30 days (trial). Or use one of your own cards and immediately cancel from the portal to avoid the eventual charge.
- Confirm the live webhook in Stripe Dashboard shows a successful **200** delivery.
- Verify the `subscriptions` row in Supabase has `status='trialing'` and a live `cus_…` / `sub_…`.

---

## Notes

- **Preview deployments**: if you want PR/preview builds on Vercel to also accept Stripe traffic, you'd need a second webhook endpoint pointed at the preview URL. For most projects it's fine to keep test keys in Preview/Development and leave previews un-webhooked.
- **Test → live is one-directional per object**: customers, subscriptions, and prices created in test mode never appear in live mode. Live customers must be created fresh through the live checkout flow.
- **Local development should keep using test keys**, with `stripe listen --forward-to localhost:3000/api/stripe/webhook` for webhook forwarding.
