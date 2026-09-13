# DoNext V2.11.10 Verification

## Release scope
V2.11.10 is a deployment/configuration hardening release based on V2.11.9. Workout UI, local-first logging, manual weight override, history details, and the V2.11.8 auth hardening remain unchanged unless noted in this document.

## Configuration checks
- `wrangler.toml` exists.
- `keep_vars = true` is present.
- `secrets.required` contains `DONEXT_AUTH_SECRET`.
- `ASSETS` points to `./public`.
- `DONEXT_KV` points to namespace `0cb1de994dd6458d8887cac2225d9222`.
- No secret value is present in repository files.

## Required production test
1. Ensure `DONEXT_AUTH_SECRET` exists as a Cloudflare Runtime Secret.
2. Deploy V2.11.10 through the connected GitHub/Cloudflare workflow.
3. Confirm the deployment succeeds. If the required secret is absent, Wrangler should reject the deployment rather than silently producing an auth-broken version.
4. Open `https://donext.chiips.workers.dev/`.
5. Test email account registration.
6. Test login with the created account.
7. Test `/api/auth/me` while logged in.

## Important
Google and Apple are still placeholders and are not part of this production test.
