# DoNext V2.11.1 — Verification checklist

## Static checks
- JavaScript syntax checked with Node.
- OpenAPI YAML parsed successfully.
- All six expected operation IDs are present.
- Stable production server is `https://donext.chiips.workers.dev`.
- Wrangler KV namespace ID is `0cb1de994dd6458d8887cac2225d9222`.
- Secret variable name is `DONEXT_API_TOKEN`.
- No API token value is present in the package.
- No `YOUR-...` placeholder remains.
- PWA manifest uses separate 192x192 and 512x512 icons.
- Service-worker cache is `donext-v2.11.1`.
- Package contains one copy of each runtime file in the intended path.

## Offline behavior
- Local state is saved before remote upload is attempted.
- Failed workout uploads remain in `pendingSync`.
- Pending workouts retry automatically.
- History is merged by session ID.
- A populated local program is not replaced by empty/incomplete remote program data.
- Local progress is protected while pending workouts exist.

## Important note
The Cloudflare secret value cannot be verified from repository files because it must remain outside the repository. After deployment, the Worker must have `DONEXT_API_TOKEN` configured as a secret before the API can authenticate requests.
