# DoNext V2.11.12 release notes

V2.11.12 is a deployment-recovery release based on V2.11.10. No workout logic or authentication algorithm was intentionally changed.

## Deployment/configuration changes
- Restores an explicit Worker entry point: `main = "./worker.js"`.
- Preserves Workers Static Assets via `./public` and `ASSETS`.
- Preserves `run_worker_first = ["/api/*"]` and SPA fallback.
- Preserves the `DONEXT_KV` binding.
- Keeps dashboard-managed variables with `keep_vars = true`.
- Removes `secrets.required` from this release so a missing dashboard secret cannot block the Worker Build before the Worker is restored.
- Pins Wrangler `4.131.1` in `package.json` so Workers Builds uses an explicit Wrangler version.

## Deliberate non-changes
- No change to email/password auth logic.
- No change to workout logging, progression, manual weight override, history, or local-first sync.
- No Google/Apple provider implementation.
