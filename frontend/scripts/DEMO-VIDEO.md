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
npm run demo-video:import -- /path/to/Human-Imprint-v13.html /path/to/Design-Bridge.html
```

The importer extracts the existing media and JavaScript without recompression or
rebuilding the animation. It preserves query controls such as
`/demo-video?frame=1860` and the linked brand guide. The export manifest records
source and asset hashes. It retains older hashed assets for already-open viewers;
remove obsolete files only when those revisions no longer need to be served.

The current v13 review is 4:00. Four act openings start at frames 1200
(doctor/question), 2910 (human judgment), 3300 (conversation to knowledge),
and 5100 (collective contribution). The closing starts at frame 6600; the final
CrediGraph wordmark is settled by frame 7050. It ends with:
전문가와 AI가 함께 성장하는 생태계를 만들어갑니다.

The ending shows reciprocal expert–AI growth and uses the established black
Credi / green Graph wordmark from the user's previous video. The new original
108 BPM instrumental score runs through the film and resolves with the logo.
The importer supports audio/mpeg as well as the existing WAV/video types.

Earlier visuals and narration timing (0–220s) are preserved. The genuine
referral conversation remains complete; the customized-AI sequence is intact.
Teaching and sharing use motion graphics. Doctor and expert scenes now use
user-supplied AI-generated moving clips, cropped from preserved originals.
The player discloses fictional generated people and future-model concepts.
Recorded narration remains pending; captions are provisional.

Verify the production build, playback, chapter seeking, the guide return link,
mobile layout, `X-Robots-Tag`, asset cache headers and video byte-range responses
before publishing an updated export.
