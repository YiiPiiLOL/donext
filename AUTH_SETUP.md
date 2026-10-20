# DoNext V2.11.12 – Auth setup

## Runtime secret
The Worker expects the Cloudflare Runtime Secret `DONEXT_AUTH_SECRET` (minimum 32 characters). The value must never be stored in GitHub.

For this recovery release, the secret is intentionally **not** declared with `secrets.required` in `wrangler.toml`. The goal is to restore the full Worker deployment first; the secret can then be added through Cloudflare Settings → Variables and Secrets.

## Required bindings
- `DONEXT_KV` → namespace `donext-training`
- `ASSETS` → Workers Static Assets binding

## Provider status
Google and Apple endpoints remain reserved placeholders and are not production-ready in this version.
