# Internal motion review

`/demo-video` serves the current HTML review without entering the application
shell. No navigation or sitemap link is added. HTML metadata and response headers
request no indexing; the URL is unlisted, not access-controlled.

The checked-in `public/demo-video/` export is sufficient for a normal Next.js
build. It does not require Remotion, a video render, or the local production files.
Media and the player bundle use content-hashed filenames and long-lived caching.
The HTML stays revalidatable, so the same sharing URL can show a later revision.

To import a new verified standalone review, from `frontend/`:

```sh
npm run demo-video:import -- /path/to/Human-Imprint-v11.html /path/to/Design-Bridge.html
```

The importer extracts the existing media and JavaScript without recompression or
rebuilding the animation. It preserves query controls such as
`/demo-video?frame=1860` and the linked brand guide. The export manifest records
source and asset hashes. It retains older hashed assets for already-open viewers;
remove obsolete files only when those revisions no longer need to be served.

The current v11 review is 3:54. The four act openings start at frames 1200
(doctor/question), 2910 (human judgment), 3300 (conversation to knowledge),
and 5100 (collective contribution). The new closing starts at frame 6600.
The genuine referral conversation remains complete. Teaching and sharing now
use motion graphics throughout, and the customized-AI sequence is preserved.

The doctor and expert currently use generated fictional starter frames.
The user requested moving footage too; image-to-video generation is pending a
video-provider connection. This remaining work is disclosed in the player.
The current stills must not be described as generated or filmed video footage.
Recorded narration also remains pending.

Verify the production build, playback, chapter seeking, the guide return link,
mobile layout, `X-Robots-Tag`, asset cache headers and video byte-range responses
before publishing an updated export.
