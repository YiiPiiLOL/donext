# DoNext V2.11.9 – Auth setup

## Runtime secret

The Worker requires one runtime secret:

- `DONEXT_AUTH_SECRET`

Set it in **Workers & Pages → donext → Settings → Runtime variables and secrets** as a Secret.
Use a long random value and do not put it in GitHub or Build variables.

## Bindings

The Worker also requires these runtime bindings:

- `DONEXT_KV` → `donext-training`
- `ASSETS` → the static assets binding

The KV binding is declared in `wrangler.toml` and must also be present on the deployed Worker.

## V2.11.9 auth hardening

- Email registration/login is wrapped in server-side error handling so internal exceptions no longer become raw Cloudflare 1101 HTML pages.
- Authentication failures are logged server-side with `console.error` but sensitive values are never returned to the browser.
- Password hashing uses PBKDF2-HMAC-SHA-256 with 20,000 iterations for new test accounts. This is intentionally a conservative CPU setting for Cloudflare Workers compatibility, especially on the Workers Free CPU limit. Existing accounts retain their stored iteration count.
- Before public production release, replace this controlled-test email/password implementation with a production identity provider or a stronger managed authentication architecture. Google/Apple provider endpoints remain disabled until their real provider credentials and token verification are implemented.

## Google / Apple

The UI is present, but the server endpoints intentionally return HTTP 501 until provider credentials and server-side verification are implemented.

Do not add Google/Apple secrets yet; they are not consumed by this version.
