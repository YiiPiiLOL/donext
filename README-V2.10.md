# DoNext V2.10 — ChatGPT ↔ DoNext

V2.10 adds the API foundation for direct plan changes from ChatGPT.

### Example
User: “Till mitt nästa pass vill jag köra low row istället för hack squat.”

ChatGPT can call `replaceExercise`, and DoNext will receive the change. The app polls every 15 seconds while open.

## Cloudflare
1. Create a Cloudflare KV namespace.
2. Put its ID into `wrangler.toml` under `DONEXT_KV`.
3. Create Worker secret `DONEXT_API_TOKEN` with a strong random value.
4. Deploy with Wrangler.
5. In DoNext → Inställningar → ChatGPT ↔ DoNext, enter the Worker URL and the same token.

## ChatGPT Action
Import `openapi.yaml` into a Custom GPT Action.
Set the server URL to your Worker URL.
Use Bearer authentication with the same `DONEXT_API_TOKEN`.

The intended architecture is:
ChatGPT = coach/decision engine
DoNext API = secure transport + storage
DoNext PWA = display/logging

The app also keeps localStorage as a local fallback. API data is not mixed with the PWA cache, so app updates should not erase training data.
