# DoNext V2.11 — Verification

## Static checks
- `index.html` JavaScript passes `node --check`.
- App version displays V2.11.
- Service-worker cache name is `donext-v2.11`.
- No API token is included in the package.

## Offline behavior implemented
- Local state is written before remote sync is attempted.
- Failed workout uploads remain in `state.pendingSync`.
- Pending workouts are retried on reconnect and by the periodic sync loop.
- History is merged by session ID instead of replaced by the remote response.
- Local program/progress is protected from empty/incomplete remote state.

## Important manual acceptance test
The definitive mobile test is:

**online → synced → disable all connectivity → save workout → open History → reconnect → wait for sync → reload → verify workout and current program remain.**
