# DoNext V2.12.0 – OAuth configuration (development build)

## IMPORTANT

Do **not** deploy to production `main` until OAuth has been tested on a separate Worker/environment. The app UI and existing email/password API are preserved, but the OAuth flow has not been tested against ChatGPT in production. Cloudflare KV is eventually consistent, so authorization-code redemption and refresh-token rotation are not strictly atomic; for high-assurance production multiuser OAuth use a strongly consistent transactional store or Durable Object for one-time grants.

## 1. Configure the Worker

Set these as **Cloudflare Worker Secrets** (never put values in `wrangler.toml` or GitHub):

- `DONEXT_OAUTH_CLIENT_ID`: a stable random/public identifier (e.g. `donext-gpt-coach`)
- `DONEXT_OAUTH_CLIENT_SECRET`: long random secret, at least 32 random bytes
- `DONEXT_OAUTH_REDIRECT_URIS`: exact callback URL(s) shown in GPT Action OAuth setup, comma-separated. **Do not guess the callback URL.**
- Keep existing `DONEXT_AUTH_SECRET` secret and `DONEXT_KV` binding unchanged.

`DONEXT_OAUTH_REDIRECT_URIS` is an exact allowlist; arbitrary redirects are rejected.

## 2. GPT Action setup

- In GPT editor, open **Actions → Authentication → OAuth**.
- Client ID = `DONEXT_OAUTH_CLIENT_ID`.
- Client Secret = `DONEXT_OAUTH_CLIENT_SECRET`.
- Authorization URL = `https://donext.chiips.workers.dev/oauth/authorize` (replace with test Worker URL when testing).
- Token URL = `https://donext.chiips.workers.dev/oauth/token` (replace with test Worker URL when testing).
- Scope = `training:read training:write`.
- Token exchange method: POST request body / Basic authentication (both supported).
- Import `openapi-gpt.yaml` (change server URL for the test Worker).
- Copy the callback URL displayed by ChatGPT into `DONEXT_OAUTH_REDIRECT_URIS`.

## 3. How login works

The GPT sends the user to DoNext's `/oauth/authorize`. The user enters their existing DoNext email/password and explicitly approves the connection. A short-lived authorization code is exchanged using PKCE S256 and a confidential-client secret. OAuth access tokens expire after one hour, refresh tokens after 30 days. Tokens are stored as SHA-256 digests in KV, and associated with the user's ID. The GPT never receives the user's DoNext password.

## 4. Disconnect

In DoNext account settings, select **Koppla bort GPT-coach**. This increments an account-wide revocation epoch; all previously issued OAuth access/refresh tokens become invalid. Existing app sessions remain signed in.

## 5. Validation before merging to main

1. Run JS syntax checks and inspect the Worker configuration.
2. Test the full authorization code + PKCE S256 flow on a test Worker.
3. Confirm invalid callback, wrong PKCE, wrong client secret, expired code, and revoked tokens are rejected.
4. Test two different accounts and ensure `/api/history` never crosses accounts.
5. Test GPT Actions using the real callback URI from ChatGPT.
6. Check PWA logo/icon updates on iOS/Android and clear stale service worker caches.
7. Deploy to `main` only after successful tests and a backup.
