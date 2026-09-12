# DoNext V2.11.8

DoNext is a deliberately simple training log and workout interface. ChatGPT is the coach; DoNext stores and presents the user's plan, history, progression data, and account state.

## V2.11.8 focus

- Real-app foundation with session-based account authentication.
- Per-user state and training history in Cloudflare KV.
- Coach onboarding/profile stored per account.
- One editable workout weight field with actual-result progression retained.
- Local-first workout logging, draft persistence, event-driven sync, and history details retained.
- API token removed from the user-facing UI.
- Auth failures are returned as controlled JSON instead of raw Cloudflare 1101 HTML pages.
- Runtime binding and secret validation added to the Worker.
- New controlled-test email accounts use PBKDF2-HMAC-SHA-256 with 20,000 iterations to avoid excessive CPU demand on Cloudflare Workers Free; existing accounts retain their stored iteration count.
- Google and Apple buttons remain UI placeholders until real provider credentials and server-side token verification are configured.
- Capacitor Android configuration remains included; building an APK requires Android SDK/Gradle on the build machine.

## Required Cloudflare runtime configuration

- Runtime Secret: `DONEXT_AUTH_SECRET`
- KV binding: `DONEXT_KV` → `donext-training`
- Assets binding: `ASSETS`

`DONEXT_AUTH_SECRET` belongs under **Runtime variables and secrets**, not Build variables and secrets.

## Important release status

V2.11.8 is a controlled testing release. The email/password implementation is intentionally not presented as the final production identity architecture. Before public release, use a production identity provider/managed authentication design and complete Google/Apple server-side verification.
