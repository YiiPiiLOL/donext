# DoNext V2.11.10 release notes

## Focus
V2.11.10 is a deployment-configuration hardening release based on V2.11.9. No workout logic or authentication algorithm was intentionally changed.

## Changes
- `keep_vars = true` keeps dashboard-configured non-secret variables from being overwritten by Wrangler deployments.
- `DONEXT_AUTH_SECRET` is declared as a required secret in Wrangler configuration.
- Cloudflare/Wrangler must validate that `DONEXT_AUTH_SECRET` is configured before a deploy/version upload succeeds.
- Static Assets configuration from V2.11.9 is preserved.
- `DONEXT_KV` binding is preserved.
- All app/service-worker/documentation/package/OpenAPI version references are aligned to V2.11.10.

## Security
The secret value is NOT stored in GitHub or this package. Configure `DONEXT_AUTH_SECRET` as a Cloudflare Runtime Secret.
