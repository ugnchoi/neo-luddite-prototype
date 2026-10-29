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
npm run demo-video:import -- /path/to/Human-Imprint-v16.html /path/to/Design-Bridge.html
```

The importer extracts the existing media and JavaScript without recompression or
rebuilding the animation. It preserves query controls such as
`/demo-video?frame=1860` and the linked brand guide. The export manifest records
source and asset hashes. It retains older hashed assets for already-open viewers;
remove obsolete files only when those revisions no longer need to be served.

The current v16 review is 4:00. Act openings start at frames 1200 (doctor),
2910 (human judgment), 3300 (conversation to knowledge), and 5100 (collective
contribution). The ending starts at 6600; CrediGraph arrives at 7000 and the
camera settles at 7125. Final statement:
전문가와 AI가 함께 성장하는 생태계를 만들어갑니다.

A reviewed judgment visibly becomes the next agent question. Its contour
signature carries into personal capacity, attributed contributions and a
projected three-dimensional ecosystem. Live focus/camera motion continues
while genuine recorded UI holds on a completed answer. The original accepted
opening and authentic source conversation remain preserved.

The soundtrack combines the supplied Bodi narrator, Knox customer and Hali
expert recordings with the approved Rising Motif music. The original speaking
speed is preserved, and the music ducks around the measured speech. Voice and user-supplied character
movies are disclosed as AI generated. Collective model improvement is future
vision. No live-training or quantified improvement claim is made.

This export changes the horizontal full film only. `booth.html` and its
manifest remain the separate portrait booth v04. No app navigation links are
added. The public URL remains unlisted, not access-controlled.

Verify the production build, playback, chapter seeking, the guide return link,
mobile layout, `X-Robots-Tag`, asset cache headers and video byte-range responses
before publishing an updated export.

The deck at `/presentation` uses `assets/demo.html`. Each film import also
refreshes this entrypoint and its provenance manifest, using the same hashed
media and player as `/demo-video`, with the deck playback bridge added.
The offline deck source uses `design/presentation/prepare_film.py` to include
the standalone film and its local bridge.
