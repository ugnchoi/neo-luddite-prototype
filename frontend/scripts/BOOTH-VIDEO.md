# November 3 booth film

Two displays: the existing full film at `/demo-video` stays on the landscape
monitor. The separate 40-second portrait cut is `/demo-video/booth.html`.
Use `/demo-video/booth.html?clean=1&loop=1` for a muted full-screen loop.
Audio is optional; the story is readable without narration.

The QR links to the service first screen, https://neo-luddite-prototype.vercel.app/.
It remains still from 32–40s. The short uses the established CrediGraph wordmark,
real prototype UI, user-supplied generated human clips and labelled concept
motion for expert knowledge contributions. Existing full-film files are retained.

Import a verified source without changing the full-film manifest:
`node scripts/import-booth-video.mjs /path/to/CrediGraph-Booth-v01.html`.
Assets reuse existing content hashes. The separate booth manifest records the
source HTML, media hashes, dimensions, duration and QR destination. Existing
noindex and immutable asset headers apply. No application navigation is added.

Check a full loop, silent legibility, the genuine UI's completed-answer hold,
mobile controls, and QR decoding from final rendered frames. The video source
and standalone MP4s are delivered separately in the shared Drive folder.
