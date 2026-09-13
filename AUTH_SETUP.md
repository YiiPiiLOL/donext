# DoNext V2.11.10 – Auth setup

## Required runtime secret
The Worker requires exactly one runtime secret:

- `DONEXT_AUTH_SECRET`

The secret value must be configured in Cloudflare as a Secret. Do not put the value in GitHub, `wrangler.toml`, or frontend code.

V2.11.10 declares the secret name as required in `wrangler.toml`, so Wrangler validates its presence during deploy/version upload.

## Required bindings

- `DONEXT_KV` → KV namespace `donext-training`
- `ASSETS` → Workers Static Assets from `./public`

## Provider login status
Google and Apple endpoints remain reserved placeholders in this release. They are not production provider integrations yet.

## Important deployment behavior
`keep_vars = true` is enabled so dashboard-configured non-secret variables are retained during Wrangler deployments. Cloudflare documents that secrets are preserved across deployments; the required-secret declaration adds explicit validation so a deployment cannot silently proceed without `DONEXT_AUTH_SECRET`.
