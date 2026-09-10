# DoNext V2.11.1

Focused reliability release for offline-safe training logging and clean deployment.

## Core fixes
- A completed workout is written to local storage before any network request.
- Failed workout uploads stay in a persistent `pendingSync` queue.
- Queued workouts retry automatically when connectivity returns and during the periodic sync loop.
- Workout IDs make retries idempotent through `POST /api/workout`.
- Local and remote history are merged by workout ID rather than replacing local history wholesale.
- Empty/incomplete remote program data does not erase a populated local program.
- Local progress is protected while workouts are waiting to sync.
- The app keeps the queue inside the same local JSON state; it does not create one file per workout.
- Known temporary version-specific Worker URLs are migrated to the current app origin.
- PWA icons are provided at their correct 192x192 and 512x512 sizes.
- Service-worker cache is versioned `donext-v2.11.1`.

## Deployment structure

```text
donext/
├── worker.js
├── wrangler.toml
├── openapi.yaml
├── README.md
└── public/
    ├── index.html
    ├── manifest.json
    ├── sw.js
    ├── donext-logo-exact.png
    ├── icon-192.png
    └── icon-512.png
```

## Cloudflare configuration

- Worker name: `donext`
- Production API base: `https://donext.chiips.workers.dev`
- KV binding: `DONEXT_KV`
- KV namespace ID: `0cb1de994dd6458d8887cac2225d9222`
- Secret variable name: `DONEXT_API_TOKEN`
- The API token itself is intentionally not included in this repository or package.

## ChatGPT Actions

The OpenAPI server is the stable production Worker address above. Authentication remains HTTP Bearer using the `DONEXT_API_TOKEN` secret configured on the Cloudflare Worker.

The six actions are:

- `getDoNextState`
- `replaceDoNextState`
- `getDoNextHistory`
- `saveDoNextWorkout`
- `setNextWorkout`
- `replaceExercise`

## Offline acceptance test

1. Open DoNext and confirm `Synkad ✓`.
2. Disable Wi-Fi and mobile data.
3. Save a workout.
4. Confirm the workout remains visible in Historik and the status indicates waiting for sync.
5. Re-enable connectivity.
6. Wait for `Synkad ✓`.
7. Confirm the workout is still in Historik.
8. Reload the app.
9. Confirm both the current program and history remain present.
