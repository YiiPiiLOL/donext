# DoNext V2.11 — Offline-safe sync

V2.11 is a focused reliability update based on the mobile gym test.

### Fixed
- A completed workout is saved locally before any network request.
- Failed API requests leave the workout in a persistent `pendingSync` queue.
- Queued workouts are retried when the API becomes reachable again and on the browser `online` event.
- Workout IDs make retries idempotent: the existing Worker already replaces a matching workout ID instead of creating a duplicate.
- Remote history is merged with local history by workout ID instead of replacing local history wholesale.
- A populated local program is not replaced by an empty/incomplete remote program.
- While workouts are pending, local progress (`next`/`sessions`) is protected from a remote overwrite.
- History shows `väntar på synkning` for queued workouts.
- The local queue is part of the same JSON state; it does not create one file per workout.
- Service-worker cache is bumped to `donext-v2.11`.

### Storage model
DoNext still uses one `localStorage` state record for the app data. `pendingSync` contains only the workouts that have not yet received a successful server response. Once a workout is confirmed by the API, its queue entry is removed.

### Cloudflare
No Worker/API contract change is required for V2.11. The existing `POST /api/workout` endpoint is already idempotent by session ID.

### Test scenario
1. Open DoNext on a mobile device with a configured token.
2. Confirm `Synkad ✓`.
3. Disable Wi-Fi and mobile data.
4. Save a workout.
5. Confirm the UI says the workout is saved locally and the History entry remains visible.
6. Re-enable connectivity.
7. Confirm the status becomes `Synkad ✓` and the workout remains in History.
8. Reload the app and confirm both the current program and history remain present.
