# V2.10 GitHub package — verification

This package is based on the actual DoNext V2.10 ChatGPT API build found in the workspace:
DoNext_V2.10_CHATGPT_API.zip

Verified original files:
- index.html
- manifest.json
- sw.js
- donext-logo-exact.png
- icon-192.png
- icon-512.png
- worker.js
- wrangler.toml
- openapi.yaml
- README-V2.10.md

Packaging correction for GitHub/Cloudflare:
The original V2.10 archive stored the static assets at the archive root while
wrangler.toml declared assets.directory = "./public". This package moves only
the static assets into public/ so that the declared Cloudflare asset directory
matches the actual files. Application code is otherwise preserved.

IMPORTANT:
wrangler.toml still contains the placeholder:
REPLACE_WITH_KV_NAMESPACE_ID

Do not deploy until the real ID of the existing `donext-training` KV namespace
has been inserted. Do not invent or change the DONEXT_API_TOKEN secret here;
that secret belongs in Cloudflare Secrets and should not be committed to GitHub.
