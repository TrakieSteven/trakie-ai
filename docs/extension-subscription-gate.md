# Extension subscription gate — implementation plan

## Context

The Trakie Chrome extension currently runs anonymously: it generates a session UUID, shows a QR, and pairs with a mobile device through the relay. Anyone who installs it can use it.

Now that we charge for Trakie, the extension must require an active Trakie.ai subscription. A user who installs the extension from the Web Store should be forced to sign in to their Trakie account, and the relay should refuse to pair if the account doesn't have an active subscription.

This change touches three repos:
- `trakie-ai` — new endpoints + a small pairing-code page + DB schema
- `demo-repository/extension` — login flow, gate UI, token storage
- `demo-repository/relay` — token verification at `session:join` (the actual security boundary)

---

## Decisions (confirmed)

- Pairing code is **shown on screen**; user copies it into the extension.
- `past_due` counts as active access (parity with the website).
- Relay is deployed on **Railway**.
- Relay caches token verification for **60s** to balance latency vs. revocation speed.

---

## Security model in one paragraph

The popup's gate UI is for UX only — anyone can sideload a modified extension that skips the gate. The actual access control lives at the **relay**. On every `session:join`, the relay calls `trakie.ai/api/extension/verify` with the user's Supabase access token; if the user has no active subscription, the relay refuses the join and the session never pairs. Cancellation in the Customer Portal flips the subscription row's status to `canceled`, which the next relay verify call (within 60s) sees, and the extension is locked out.

---

## Architecture flow

```
┌──────────────┐    1. Open popup
│   Browser    │ ─────────────────────────────────────────────┐
│  Extension   │                                              │
└──────┬───────┘                                              │
       │ 2. Not signed in → click "Sign in to Trakie"          │
       │    Opens https://trakie.ai/extension/connect          │
       ▼                                                       │
┌──────────────┐                                              │
│  trakie.ai   │ 3. AuthModal if needed → check subscription   │
│   /extension │    → POST /api/extension/issue-code           │
│   /connect   │ 4. Show 8-char pairing code on screen         │
└──────────────┘                                              │
                                                              │
       ┌──────────────────────────────────────────────────────┘
       │ 5. User pastes code into extension
       ▼
┌──────────────┐
│   Extension  │ 6. POST /api/extension/exchange-code (code)
│              │ ─→  { access_token, refresh_token } stored in chrome.storage.local
└──────┬───────┘
       │ 7. GET /api/extension/status (Bearer token)
       ▼ ─→  { subscribed: true } → render QR + connect to relay
       │
       ▼ socket.emit("session:join", { sessionId, deviceType, token })
┌──────────────┐ 8. POST trakie.ai/api/extension/verify (token)
│   Relay      │     → { ok, user_id }   (cached 60s)
│  (Railway)   │ 9. If !ok → refuse join with reason
└──────────────┘
```

---

## Phase 1 — `trakie-ai` (the source of truth)

### 1.1 Schema (`supabase/migrations/0002_extension_pairing.sql`)

```sql
create table if not exists public.extension_pairing_codes (
  code text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now() not null,
  consumed_at timestamptz,
  expires_at timestamptz default (now() + interval '10 minutes') not null
);

create index if not exists extension_pairing_codes_user_id_idx
  on public.extension_pairing_codes (user_id);

alter table public.extension_pairing_codes enable row level security;
-- writes only via service role (no client policies needed)
```

User runs the SQL in Supabase SQL editor.

### 1.2 New API endpoints

All in `app/api/extension/*/route.ts`. Pattern matches existing `app/api/stripe/*` routes.

#### `POST /api/extension/issue-code`
- Auth: requires logged-in user (cookie session via `lib/supabase/server.ts`).
- Reads the user's subscription row. If no active subscription, returns `{ ok: false, reason: 'no_subscription' }` with 200 (so the page can render the upgrade CTA cleanly — not an error).
- If active, generates an 8-character uppercase alphanumeric code (collision-checked against unconsumed/non-expired rows), inserts into `extension_pairing_codes`, returns `{ ok: true, code, expires_at }`.

#### `POST /api/extension/exchange-code`
- Body: `{ code: string }`.
- No cookie auth — this is called from the extension which has no session yet.
- Uses service-role client to look up the code: must exist, be unconsumed, not expired.
- Mints a Supabase session for the user_id from the code. **Important detail**: Supabase doesn't have a public "mint a session for arbitrary user" admin API. Two options:
  - **Option A (recommended)**: store a long-lived `extension_tokens` row instead of using Supabase sessions. We control issuance + revocation. Simpler.
  - **Option B**: use `supabase.auth.admin.generateLink({ type: 'magiclink', email })` and parse the resulting tokens — fragile, intended for emails.
- **Going with Option A**: extend the schema to also create an `extension_tokens` table:

  ```sql
  create table if not exists public.extension_tokens (
    token text primary key,            -- random 256-bit, base64url
    user_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz default now() not null,
    last_used_at timestamptz default now() not null,
    revoked_at timestamptz
  );
  create index if not exists extension_tokens_user_id_idx on public.extension_tokens (user_id);
  ```

  `exchange-code` consumes the pairing code and inserts a fresh `extension_tokens` row. Returns `{ token, user_id }`. Token is opaque to the extension.

#### `GET /api/extension/status`
- Header: `Authorization: Bearer <token>`.
- Service-role client looks up `extension_tokens` (must exist, not revoked) → user_id → reads subscriptions row → returns `{ subscribed, status, trial_end, current_period_end }`.
- Updates `last_used_at` on the token row.
- 401 if token invalid/revoked.

#### `POST /api/extension/verify` (called by the relay, not the extension)
- Header: `Authorization: Bearer <RELAY_SHARED_SECRET>` (env var, separate from user tokens).
- Body: `{ user_token: string }`.
- Same logic as `/status` but auth is shared-secret — guarantees only our relay can call it. Returns `{ ok, user_id, status }`.
- Add `RELAY_SHARED_SECRET` to `.env.local`.

#### `POST /api/extension/revoke` (optional, v2)
- Lets the user revoke a device from their `/account/subscription` page. Skip for v1.

### 1.3 New page: `app/extension/connect/page.tsx`

- Server component. Auth-gates via `createClient()` server-side. If no user, redirect to `/login?next=/extension/connect`.
- Reads subscription. Renders a client component:
  - **Has active subscription** → shows a "Generate pairing code" button. On click, POSTs to `/api/extension/issue-code`. Renders the returned code in a big monospace box with a copy button + "Expires in 10 min" timer.
  - **No active subscription** → renders headline "Trakie subscription required to use the extension" + the standard "Start Free 30-Day Trial" CTA (reusing `startCheckout()` flow from `SubscriptionView`).

Match the existing `account-card` styling — tight, centered card, "Back to Trakie.ai" link at top.

### 1.4 Files touched / created

**New:**
- `supabase/migrations/0002_extension_pairing.sql`
- `app/api/extension/issue-code/route.ts`
- `app/api/extension/exchange-code/route.ts`
- `app/api/extension/status/route.ts`
- `app/api/extension/verify/route.ts`
- `app/extension/connect/page.tsx`
- `components/extension/ConnectView.tsx`

**Modified:**
- `app/globals.css` — small additions for code-display block (reuse `account-*` classes where possible)
- `.env.local` — add `RELAY_SHARED_SECRET`

---

## Phase 2 — `demo-repository/extension`

### 2.1 Auth state

New module `src/auth.ts`:
- `async function getToken(): Promise<string | null>` — reads from `chrome.storage.local`.
- `async function setToken(token: string): Promise<void>`.
- `async function clearToken(): Promise<void>`.
- `async function checkAccess(): Promise<{ subscribed: boolean, reason?: string }>` — calls `GET /api/extension/status` with the bearer token. Caches result in `chrome.storage.session` for 5 min.

### 2.2 Popup gate

In `popup.ts`, on `DOMContentLoaded`:

```ts
const token = await getToken();
if (!token) { renderSignInGate(); return; }

const access = await checkAccess();
if (!access.subscribed) { renderSubscriptionGate(access.reason); return; }

// existing flow: generate session, render QR, connect to relay (with token)
```

### 2.3 Three new popup views

Add to `popup.html` (hidden by default, shown by JS):

#### Sign-in gate
- Heading: "Sign in to use Trakie"
- Body: "You'll get a pairing code on the next screen."
- Button: **"Open Trakie.ai to sign in"** → opens `https://trakie.ai/extension/connect` in a new tab via `chrome.tabs.create`.
- Below: a paste box + "Connect" button. User pastes the 8-char code.
- On Connect → `POST /api/extension/exchange-code` → store token → re-run gate logic.

#### Subscription gate (signed in but no active sub)
- Heading: "Active subscription required"
- Body: "Your Trakie account doesn't have an active subscription."
- Button: **"Manage subscription"** → opens `https://trakie.ai/account/subscription`.
- Smaller link: "Sign in as a different user" → `clearToken()` → re-render.

#### Connected (existing QR + live view)
- Existing UI, unchanged. Plus a small "Signed in as {email}" footer with a "Sign out" link.

### 2.4 Token in `session:join`

Modify the existing `socket.emit("session:join", ...)` to include the token:

```ts
socket.emit(
  "session:join",
  { sessionId, deviceType: "extension", token },
  (res) => {
    if (!res.ok) {
      // res.error === 'subscription_required' → re-run checkAccess() + show gate
      // res.error === 'invalid_token' → clearToken() → show sign-in gate
    }
  }
);
```

### 2.5 Files touched / created

**New:**
- `src/auth.ts`
- `src/gate-views.ts` (renderSignInGate, renderSubscriptionGate)

**Modified:**
- `src/popup.ts` — gate orchestration, pass token to relay
- `src/popup.html` — add hidden gate sections
- `styles/*.css` — gate styling
- `manifest.json` — add `"https://trakie.ai/*"` to `host_permissions` (required to fetch our API + open in new tab)

### 2.6 No email lookup needed for "Signed in as"
Save the user's email in `chrome.storage.local` next to the token (returned by `/exchange-code`). Display only.

---

## Phase 3 — `demo-repository/relay`

### 3.1 Token verification at `session:join`

Modify `src/index.ts` line 42:

```ts
socket.on("session:join", async (data, callback) => {
  const { sessionId, deviceType, token } = data;
  if (!sessionId || !deviceType) { callback({ ok: false, error: "Missing sessionId or deviceType" }); return; }

  if (deviceType === "extension") {
    if (!token) { callback({ ok: false, error: "missing_token" }); return; }
    const verify = await verifyExtensionToken(token);
    if (!verify.ok) { callback({ ok: false, error: verify.reason }); return; }
    socket.data.userId = verify.userId;
  }
  // existing pairing logic...
});
```

`verifyExtensionToken(token)`:
- Checks an in-memory `Map<string, { userId, expires }>` cache (60s TTL).
- On miss, POSTs to `${TRAKIE_API_URL}/api/extension/verify` with `{ user_token: token }` and `Authorization: Bearer ${RELAY_SHARED_SECRET}`.
- Caches `{ ok: true, userId }` results. Caches `{ ok: false, reason }` results for 30s (shorter — so a user who just subscribed isn't locked out for a full minute).
- On network error, fail closed (`{ ok: false, reason: 'verify_unavailable' }`).

### 3.2 Mobile device — what about it?

The **mobile** device pairs via QR-encoded session ID, not user token. The mobile session inherits access from the extension: if the extension was allowed to join, the session is valid. Mobile doesn't need to authenticate — it can only join sessions that already have an authenticated extension. Update mobile-side code? **No** — current behavior already requires the extension to join first.

But we should reject a mobile join if the extension hasn't joined yet AND no extension joins within ~60s, to avoid orphan mobile sessions. This is a small bonus; can defer.

### 3.3 Env vars on Railway

Add:
- `TRAKIE_API_URL` = `https://trakie.ai`
- `RELAY_SHARED_SECRET` = same value as in `trakie-ai/.env`

### 3.4 Files touched / created

**New:**
- `src/auth.ts` (verifyExtensionToken, cache)

**Modified:**
- `src/index.ts` — token check at `session:join`
- `railway.json` or Railway dashboard — env vars

---

## Phase 4 — error UX in the extension

Map relay errors to user-facing copy:

| Relay error | Extension shows |
|---|---|
| `missing_token` | Sign-in gate |
| `invalid_token` | Sign-in gate (clear stored token) |
| `subscription_required` | Subscription gate ("active subscription required") |
| `verify_unavailable` | Toast: "Can't reach Trakie servers — try again in a moment." Stay on current view. |

---

## Verification (end-to-end)

1. Run `0002_extension_pairing.sql` in Supabase.
2. Set `RELAY_SHARED_SECRET` in `trakie-ai/.env.local` (and on Railway later).
3. Build the extension locally, load unpacked in Chrome.
4. Open popup → see sign-in gate → click "Open Trakie.ai to sign in".
5. Land on `/extension/connect` → if logged out, log in → see pairing code.
6. Copy code into extension → click Connect → popup transitions to QR view.
7. Pair mobile (existing flow) → confirm extraction streams arrive.
8. Cancel subscription in `/account/subscription` (Stripe portal).
9. Wait ~60s, refresh popup → extension shows subscription gate. Mobile session refuses to pair.
10. Reactivate subscription → extension recovers within 60s on next popup open.
11. Edge case: clear `chrome.storage.local`, reopen popup → sign-in gate shown again.
12. Edge case: in DB, delete the `extension_tokens` row directly → next status call returns 401 → extension auto-clears token and shows sign-in gate.

---

## Out of scope (v1)

- Multi-device management UI (revoke a specific device from the website).
- Refreshing tokens — `extension_tokens` are long-lived until revoked or DB-deleted. If we want rotation, add an `expires_at` column and a refresh endpoint later.
- Mobile-device subscription gating (mobile inherits via paired session — see 3.2).
- Telemetry / "extension last seen" UI.
- Auto-handoff via `chrome.runtime.sendMessage` (v1 is code-on-screen).

---

## Sequencing

Three repos, but they can be built mostly in order:

1. **trakie-ai first** — schema + endpoints + connect page. Test by curling endpoints. Nothing else depends on the trakie-ai changes being done.
2. **Relay next** — wire `verify` call. Test against trakie-ai locally.
3. **Extension last** — once both backends are live, build the popup gate flows. This is the most user-visible piece, easiest to iterate on once the APIs are stable.
