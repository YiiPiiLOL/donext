# DoNext V2.11.7 — Auth setup

## What is already implemented

- API token is no longer exposed in the UI.
- Session-based Authorization replaces the user-entered API token.
- Per-user state is stored under `state:<userId>`.
- Email/password registration and login are implemented with PBKDF2 password hashing.
- Persistent 30-day signed sessions are implemented.
- Coach profile is persisted per user.
- Test-account reset clears that user's coach profile and training state.
- Google and Apple endpoints are reserved but intentionally return 501 until provider credentials and server-side token verification are configured.

## Required Cloudflare secrets

Set `DONEXT_AUTH_SECRET` to a long random secret before deploying this worker.

Do NOT reuse the old `DONEXT_API_TOKEN` for this purpose.

## Google / Apple

Before enabling provider login, configure the provider client identifiers, redirect URIs and server-side token verification/JWKS handling. Also implement account linking by verified provider subject + verified email rules so one person cannot accidentally create duplicate accounts.

## Important

Do not deploy this release to the public Worker until `DONEXT_AUTH_SECRET` is set and Google/Apple production credentials have been configured. Email login can be used for controlled testing once the auth secret is set.
