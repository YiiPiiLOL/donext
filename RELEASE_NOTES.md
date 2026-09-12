# DoNext V2.11.9 release notes

## Why V2.11.9 exists

V2.11.7 reached the production Worker and static assets successfully, and `/api/auth/me` responded with the expected unauthenticated response. The failure was isolated to email account authentication: creating an account produced Cloudflare 1101. The strongest code-level suspect was the CPU-heavy PBKDF2 step in the register path, but the production exception was not exposed by the available dashboard metrics, so V2.11.9 both reduces that cost and adds explicit exception diagnostics.

The V2.11.7 email-auth path used PBKDF2-HMAC-SHA-256 at 120,000 iterations. Cloudflare documents a 10 ms CPU limit on Workers Free and 1102 for explicit CPU-limit exhaustion. The new release reduces the cost for new controlled-test accounts to 20,000 iterations while retaining the iteration count on existing accounts. The release also catches authentication exceptions so an internal failure returns controlled JSON and is logged server-side instead of becoming a raw 1101 page.

## Additional hardening

- Runtime secret and KV binding are validated before auth work.
- Password records store `passwordIterations`.
- Session signatures use HMAC-SHA-256.
- Byte comparisons use a fixed-length XOR accumulator rather than relying on a Node-only crypto helper in the local test harness.
- Client API handling parses JSON errors and no longer displays raw Cloudflare HTML.
- A transient `/api/auth/me` failure no longer automatically deletes the local session; the client clears the session only on HTTP 401.
- Malformed JSON is handled as HTTP 400.

## Important

This is a controlled testing release, not the final production identity architecture. Google/Apple authentication still requires real provider credentials and server-side token verification. Email/password auth should be revisited before broad public release.

## V2.11.9 — Static Assets & API Routing Fix

- Restored the Wrangler configuration required to package and serve `public/` as Workers Static Assets.
- Restored the `ASSETS` binding in deployment configuration.
- Added `not_found_handling = "single-page-application"` for SPA fallback.
- Added `run_worker_first = ["/api/*"]` so API requests always execute Worker code while normal frontend assets are served by Cloudflare's asset layer.
- This directly addresses the V2.11.8 production exception where `env.ASSETS` was undefined.
