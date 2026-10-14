# November 3 booth film

Two displays: the existing full film at `/demo-video` stays on the landscape
monitor. The separate 40-second portrait cut is `/demo-video/booth.html`.
Use `/demo-video/booth.html?clean=1&loop=1` for a muted full-screen loop.
Audio is optional; the story is readable without narration.

The QR links to the service first screen, https://neo-luddite-prototype.vercel.app/.
It remains still from 32–40s. The short uses the established CrediGraph wordmark,
real prototype UI, user-supplied generated human clips and labelled concept
motion for expert knowledge contributions. Existing full-film files are retained.

Revision v02 focuses on the customer's experience:

- 0–4s: the doctor's question.
- 4–11s: genuine chat UI at 1.5×, ending with a 1.27-second expert recommendation hold.
- 11–19s: the selected expert's AI responds immediately; an animated feedback loop
  explains how the expert monitors answers and improves guidance.
- 19–25s: direct chat and meetings with the expert for important moments.
- 25–32s: experts collectively build a tax AI model, with cases, judgement and review.
- 32–40s: the existing CrediGraph closing and stationary service QR.

Expert oversight and collective model improvement use concept graphics; the
chat excerpt is recorded prototype UI. The full four-minute film is unchanged.

Import a verified source without changing the full-film manifest:
`node scripts/import-booth-video.mjs /path/to/CrediGraph-Booth-v02.html`.
Assets reuse existing content hashes. The separate booth manifest records the
source HTML, media hashes, dimensions, duration and QR destination. Existing
noindex and immutable asset headers apply. No application navigation is added.

Check a full loop, silent legibility, the genuine UI's completed-answer hold,
mobile controls, and QR decoding from final rendered frames. The video source
and standalone MP4s are delivered separately in the shared Drive folder.
