# DoNext V2.11.12

DoNext is a deliberately simple training log and workout interface. GPT is the coach; DoNext stores, displays, and transports the training data.

## V2.11.12 focus
This release restores the full Worker + Static Assets deployment path after the previous build was detected by Cloudflare as an assets-only Worker.

- Worker entry point: `./worker.js`
- Static assets: `./public` via `ASSETS`
- API routes run through the Worker first
- KV binding: `DONEXT_KV` → `donext-training`
- Dashboard-managed runtime variables are preserved with `keep_vars = true`
- Wrangler is pinned to `4.131.1`

## Authentication
The Worker expects the Runtime Secret `DONEXT_AUTH_SECRET`. Do not store the secret in GitHub. This release intentionally does not use `secrets.required`; restore the Worker deployment first, then add the secret in Cloudflare Settings → Variables and Secrets.

Google and Apple endpoints remain placeholders.
