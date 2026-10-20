# DoNext V2.11.12 Verification

V2.11.12 is a deployment-recovery release based on V2.11.10.

## Static checks
- `worker.js` must parse as JavaScript.
- `public/index.html` must contain `V2.11.12`.
- `public/sw.js` must use `donext-v2.11.12`.
- `wrangler.toml` must contain `main = "./worker.js"`.
- `wrangler.toml` must contain the `ASSETS` binding and `DONEXT_KV`.
- `wrangler.toml` must not contain `secrets.required` in this recovery release.
- `package.json` pins Wrangler `4.131.1`.
- No secret values may exist in repository files.

## Cloudflare acceptance
1. Push the V2.11.12 repository files to the connected `main` branch.
2. Confirm Workers Builds completes successfully.
3. Confirm the deployment is a Worker deployment, not an assets-only deployment.
4. Confirm Settings → Variables and Secrets becomes available for the Worker.
5. Add `DONEXT_AUTH_SECRET` as a Runtime Secret.
6. Test `/` and then email account creation.

## Important
Do not commit the value of `DONEXT_AUTH_SECRET` to GitHub.
