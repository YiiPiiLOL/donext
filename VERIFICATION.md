# DoNext V2.11.9 Verification

## Scope

V2.11.9 is based on the stable V2.11.4 frontend behavior and V2.11.7 real-app/auth foundation.

### Preserved behavior

- One editable workout `Vikt` field per exercise.
- Actual workout weight and recommended weight are both retained in stored workout data.
- Future recommendations use actual previous performance.
- Local-first saves, pending sync queue, draft persistence, and event-driven sync remain in place.
- History rows open detailed workout records.
- API-token input is not exposed to users.

### Auth hardening

- Email registration/login is wrapped in controlled server-side error handling.
- Malformed JSON returns HTTP 400 JSON.
- Missing/invalid runtime auth configuration returns controlled HTTP 503 JSON instead of an uncaught Worker exception.
- Internal auth errors are written to Worker logs without returning stack traces or secret values to the client.
- Session HMAC uses `DONEXT_AUTH_SECRET`.
- Password records store their PBKDF2 iteration count so existing accounts can continue to authenticate after tuning.
- New controlled-test accounts use 20,000 PBKDF2-HMAC-SHA-256 iterations.
- Frontend API handling extracts JSON error messages instead of displaying raw Cloudflare HTML error pages.

## Static checks completed

- `worker.js`: `node --check` passes.
- Embedded frontend JavaScript: `node --check` passes.
- Service worker: valid JavaScript and cache version `donext-v2.11.8`.
- No `setInterval(pullRemote, ...)` polling timer reintroduced.
- No `DONEXT_API_TOKEN` dependency in the V2.11.9 Worker.
- `DONEXT_KV` and `ASSETS` bindings remain declared in `wrangler.toml`.

## Local Worker harness tests completed

A local Worker harness was run with simulated KV and `DONEXT_AUTH_SECRET`.

- [x] Register new email account → HTTP 200.
- [x] Returned session token → accepted by `/api/auth/me`.
- [x] Login with correct password → HTTP 200.
- [x] Login with wrong password → HTTP 401.
- [x] Save coach profile with authenticated session → HTTP 200.
- [x] Read state with authenticated session → HTTP 200.
- [x] Set next workout with authenticated session → HTTP 200.
- [x] Malformed auth JSON → HTTP 400.
- [x] Missing `DONEXT_AUTH_SECRET` → controlled HTTP 503.
- [x] Missing `DONEXT_KV` → controlled HTTP 503.
- [x] Existing account using stored 120,000 PBKDF2 iterations → login succeeds.

## Cloudflare production tests still required

1. Deploy V2.11.9 to the DoNext Worker.
2. Confirm `DONEXT_AUTH_SECRET` is present under Runtime variables and secrets.
3. Confirm `DONEXT_KV` is bound to `donext-training`.
4. Open DoNext and use **Skapa konto** with a new test address.
5. Confirm the user reaches coach onboarding instead of a Cloudflare error page.
6. Save coach onboarding and reload the app.
7. Confirm the account remains authenticated and the coach profile persists.
8. Log out and log in again.
9. Confirm workout history is still associated with the same account.

## Provider status

- [ ] Google credentials and server-side ID-token verification configured.
- [ ] Apple credentials and server-side identity-token verification configured.
- [ ] Production identity/auth architecture review completed.
- [ ] Account deletion flow implemented before public App Store release.
