# Internal motion review

`/demo-video` serves the approved HTML film without entering the application
shell. No navigation or sitemap link is added. HTML metadata and response headers
request no indexing; the URL is unlisted, not access-controlled.

The checked-in `public/demo-video/` export is sufficient for a normal Next.js
build. It does not require Remotion, a video render, or the local production files.
Media and the player bundle use content-hashed filenames and long-lived caching.
The HTML stays revalidatable, so the same sharing URL can show a later revision.

To import a new approved standalone review, from `frontend/`:

```sh
npm run demo-video:import -- /path/to/Human-Imprint-v10.html /path/to/Design-Bridge.html
```

The importer extracts the existing media and JavaScript without recompression or
rebuilding the animation. It preserves query controls such as
`/demo-video?frame=1860` and the linked brand guide. The export manifest records
source and asset hashes. It retains older hashed assets for already-open viewers;
remove obsolete files only when those revisions no longer need to be served.

The current v10 film is 3:38. Expert selection starts at `/demo-video?frame=1980`;
the customized-AI explanation starts at `/demo-video?frame=2370`. It clarifies
immediate engagement, preliminary questions, addressable answers and escalation
to the expert with the conversation context. Recorded narration is still pending.

Verify the production build, playback, chapter seeking, the guide return link,
mobile layout, `X-Robots-Tag`, asset cache headers and video byte-range responses
before publishing an updated export.
