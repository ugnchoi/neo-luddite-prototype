# Homepage consultation story

Current public-homepage refinement, 2026-10-20. Mode: Persuade. Audience: Korean small-business and SME owners. The primary action is to ask a question immediately; `/about` remains the deeper explanation of professional participation and the current service boundary.

This document records the local composition of `/` and its immediate guest entry. [DESIGN.md](../DESIGN.md) and [.impeccable/design.json](../.impeccable/design.json) remain the authority for the application-wide Luminous system. The local, untracked [surface contract](../.impeccable/surfaces/frontend-app-page-tsx.md) defines this refinement; the older [guest-entry record](guest-chat-entry.md) retains the history of the conversation and account flow.

## Composition

The first viewport pairs the two-line promise “AI와 시작하고, 세무사와 이어가세요.” with an explicit small-business audience statement, a broad question field, one editable vehicle-cost example, and the current prototype disclosure. The question field is the main action. The text-labeled submit control, login, service introduction, and theme control remain visible controls.

The story develops one consultation record through three stages: the owner's question, context organized into a consultation memo, and a prepared question to continue with a tax professional. The same question stays in the same frame while information accumulates. The memo distinguishes known facts, an open question, and documents to prepare. The record is labeled as an example, with the clinic vehicle scenario and its limits stated beneath it.

Below the record, a short professional-collaboration statement links to `/about`, followed by a return to the question field. About retains its audience explanation, professional-participation narrative, consultation journey, prototype limitations, and browser-storage explanation.

The preceding revision at `ffa4d168e25edfb4293ca20600dc7e86fd0b5973` used tilted paper, large punctuation, sample portraits, and separate visual scenes. The supplied review identified competing invitations, weak visibility of the sample boundary, and internal mobile clipping despite zero page overflow. This revision replaces those props and scene changes with the aligned record. The preceding heuristic assessment was 20/32 across applicable Nielsen heuristics; it is a baseline assessment, not a new score or conversion measurement.

## Relationship to the incumbent system

The source comparison covers the homepage and chat/story modules against the existing root font setup, Luminous foundation styles, `DESIGN.md`, and its sidecar.

| Existing foundation | Use on this surface |
| --- | --- |
| Locally loaded Pretendard through `--font-sans` | Korean display, body, and supporting text; Korean word groups remain intact with `word-break: keep-all`. |
| `--ds-paper`, `--ds-canvas`, `--ds-ink`, `--ds-muted` | Paper for the first task and record; quiet canvas for the story; existing reading and supporting ink. |
| `--ds-accent`, `--ds-accent-hover`, `--primary-foreground` | Public teal actions, paired button text, emphasis, links, and focus. Existing dark-theme values remain inherited. |
| `--ds-line`, `--ds-field-line` | Fine document divisions and the stronger composer boundary. |
| `ImprintMark`, `--ds-imprint`, Lucide icons | The established public identity and small functional symbols. The mark does not imply answer review or provenance. |
| Application theme and shared guest composer/store | Existing theme ownership, input behavior, draft scope, conversation creation, and send/navigation mechanics. |

The homepage introduces no global tokens, new identity, or raster artwork. Its paper surfaces use boundaries and tonal differentiation rather than the old nested floating panel. The memo pane mixes the existing canvas and paper tokens. Local dimensions remain surface recipes: the hero is capped at 1200px, the composer at 800px, and the story at 1344px. The hero display uses `clamp(46px, 4.9vw, 72px)` at weight 550; its mobile rule uses `clamp(30px, 8.2vw, 44px)`. The composer’s 14px corners, record’s 16px desktop/12px mobile corners, and labeled send control’s 8px corners are local choices, not replacements for shared control/card/panel radii.

Existing documentation drift is recorded rather than repaired here: `DESIGN.md` still associates the homepage with the older `PublicHeader`, canvas-based headline/action composition, and 64px public-display recipe. The 2026-10-02 guest-entry brief describes the later asymmetric two-column landing and its historical verification. Neither description is the current homepage composition. The sidecar continues to describe shared system primitives; this local story’s layout and motion do not require a global token rewrite.

## Scroll and responsive behavior

Enhanced motion is gated by width of at least 1100px, height of at least 720px, and `prefers-reduced-motion: no-preference`. Native scrolling drives a scoped GSAP timeline through a sticky, viewport-height record area. The story occupies 210svh: 1890px at 1440 × 900, compared with the preceding 285svh/2565px.

The initial question stays visible. Context, the memo’s facts and document requirements, and the prepared professional question reveal in sequence with opacity and a small vertical offset. Numbered indicators and adjacent explanatory copy follow three progress stages. The meaningful static heading remains available to assistive technology; changing visual headings are marked `aria-hidden`.

Smaller or shorter viewports and reduced-motion mode show the complete record in ordinary reading order. Below 600px, conversation and memo stack vertically, the stage list is hidden, and document names remain intact. At tablet/short-desktop sizes the introduction and record also move into one main column. Short-height hero rules reduce spacing and input height so the entry and disclosure fit. GSAP match-media cleanup reverts the timeline and removes enhanced-state attributes when its conditions no longer apply.

The repeated story eyebrow has been removed from source, including its unused styles, following the independent review. The story now starts with its heading. The final independent verdict scored that correction resolved after fresh desktop, mobile and reduced-motion captures.

The static record is the layout fallback; this is not a no-JavaScript application guarantee. The existing application shell and interactive guest entry require hydration.

## Guest entry and service boundary

Selecting the example fills and focuses the editable composer. The existing entry store holds the draft by scope; send creates the conversation, sends its first turn, and navigates using that conversation ID. Entry stays disabled until account and chat hydration are ready. The shared composer retains Enter to send, Shift + Enter for a line break, and composition-input handling.

In prototype mode the hero identifies a clinic-based sample consultation, states that it provides neither actual tax judgment nor consultation intake, and explains browser-local storage. The story and footer repeat the relevant example/service limits at their own points of interpretation. Live/prototype copy remains conditional on the existing data-mode flag. This surface adds no backend, AI, professional-directory, or handoff integration.

## Verification record

The following results were supplied by the implementation/browser pass on 2026-10-20. This documentation pass checked source and review records; it did not rerun tests, the detector, screenshots, or browser QA.

| Check | Supplied evidence and current status |
| --- | --- |
| Tests, lint, build | Final source: 113/113 tests, focused ESLint, production build, and `git diff --check` passed. |
| Viewport fit | No horizontal overflow at 320 × 740, 390 × 844, 768 × 1024, or 1440 × 680. Input, send, and prototype disclosure fit in the initial viewport after the short-height adjustment. |
| Story continuity | At 1440 × 900, the question stayed in place within 1px at the sticky boundary while context, memo, and handoff content appeared. Reverse scrolling restored earlier states. |
| Motion fallback and cleanup | Reduced-motion checks showed all six reveal groups at full opacity without transforms. Resize cleanup removed the enhanced layout. |
| Independent visual review | Initial verdict: `fix`; one material item. After removal of the repeated story eyebrow and fresh captures, the same reviewer scored it resolved and returned `ship` at that fix-list scope. No whole-surface recertification is claimed. |
| Question/return navigation | Guest example selection, input focus, keyboard submit and sample reply passed without login. Native hash entries had null history state, so Next.js ignored Back restoration; four homepage anchors now use Next Link. Final production replay passed ordinary About/Back plus the closing question, hero story, footer-top and skip-link round trips, preserving route content and relevant focus. |

Local captures live under [`.impeccable/review/`](../.impeccable/review/). The review set includes [desktop](../.impeccable/review/desktop.png), [mobile](../.impeccable/review/mobile.png), [320px](../.impeccable/review/width-320.png), [768px](../.impeccable/review/width-768.png), [short desktop](../.impeccable/review/width-1440.png), [initial record](../.impeccable/review/story-0.png), [middle record](../.impeccable/review/story-0.5.png), [complete record](../.impeccable/review/story-1.png), [dark hero](../.impeccable/review/dark-hero.png), [dark story](../.impeccable/review/dark-story.png), and [reduced motion](../.impeccable/review/reduced-motion.png), plus mobile story/footer views. The middle record capture is at 60% progress despite its historical filename. Captures are local, untracked verification artifacts, not shipped artwork; the files above were refreshed from the final production build.

Browser emulation does not establish physical-device keyboard behavior, assistive-technology coverage, real tax advice, or live professional handoff. The independent visual verdict does not replace runtime or navigation verification. This record makes no deployment claim.

## Source map

| Area | Sources |
| --- | --- |
| Public composition and shared About styles | [page](../frontend/app/page.tsx), [entry styles](../frontend/app/entry.module.css), [About](../frontend/app/about/page.tsx) |
| Continuous consultation record and scoped motion | [story component](../frontend/components/marketing/consultation-story.tsx), [story styles](../frontend/components/marketing/consultation-story.module.css) |
| Hero entry variant and retained guest mechanics | [landing chat](../frontend/components/chat/landing-chat.tsx), [entry styles](../frontend/components/chat/entry-chat.module.css), [composer](../frontend/components/chat/entry-composer.tsx) |
| Hero shader grid and fallbacks | [component](../frontend/components/marketing/hero-grid/hero-grid.tsx), [renderer](../frontend/components/marketing/hero-grid/renderer.ts), [shaders](../frontend/components/marketing/hero-grid/shaders.ts), [styles](../frontend/components/marketing/hero-grid/hero-grid.module.css) |
| Incumbent foundations | [root layout](../frontend/app/layout.tsx), [Luminous tokens](../frontend/components/design-system/luminous.css), [design system](../DESIGN.md), [sidecar](../.impeccable/design.json) |

## 2026-10-28 hero shader-grid addition

The requested subtle moving grid sits behind the hero only. Fixed dot anchors carry slowly changing size and opacity from a domain-warped gradient-noise contour field. The existing `--ds-imprint` supplies its ink in both themes; a center fade keeps the headline and composer quiet, with lower opacity on mobile. The decoration is hidden from assistive technology and does not intercept pointer input. Copy, guest-entry mechanics, the consultation story, global design tokens, and identity remain unchanged. No library or raster asset was added.

The contour helper was adapted from the current local `/home/ugnchoi/projects/ripple-field/src/grid/contour.mjs`, verified on 2026-10-28 with SHA-256 `16c95fe65e3046b44cb04bebef4ee60a37d2c38c785d1d1b03cbc171e3aecf73`. That reference file was untracked when inspected; this records a local source snapshot, not Git HEAD provenance. The hero adapts its contour parameters and uses only the contour value to change dot size and ink; anchor positions stay fixed.

The WebGL2 renderer uses one static point buffer per layout, with animation draws capped at 30 per second, at most 24,000 points, a 2,000,000-pixel drawing buffer, and DPR capped at 1.5. A 44px pause/play control has a Korean accessible label and visible keyboard focus. Animation stops while paused, offscreen, or in a hidden tab. Reduced motion and unavailable WebGL retain a static CSS grid; forced colors and print hide the decoration. Context loss releases the renderer and restores the fallback, context restoration reinstalls it, and unmount disconnects observers/listeners and releases rendering resources.

Supplied implementation/browser validation for this addition:

- All 113 tests, focused ESLint, the final production build, and `git diff --check` passed; the detector returned `[]`.
- Actual draw counters froze during pause, offscreen, and hidden-tab checks. Animation time advanced over three seconds with one static buffer upload. Forced context loss/restoration and About unmount/Back passed.
- At a 3840 × 2160 viewport, the allocated canvas was 1925 × 1038 (1,998,150 pixels) with 23,730 points. Initial reduced-motion mode made zero WebGL requests; the no-WebGL fallback remained usable.
- Mobile example selection → chat → sample reply passed. The root browser validation reported zero errors and zero warnings.
- Independent visual review returned `Pass` across seven final captures, with no material issues in desktop, 320px/390px mobile, dark-theme readability, pause-control placement, or static fallbacks.

Final local, ignored screenshots are under [`output/playwright/hero-grid/`](../output/playwright/hero-grid/): `desktop.png`, `desktop-later.png`, `mobile.png`, `mobile-320.png`, `dark.png`, `reduced.png`, `no-webgl.png`, and `reduced-mobile.png`. These are browser verification artifacts; the draw limits and browser results do not establish hardware frame rates or live production deployment. This documentation pass checked source and the supplied evidence without repeating browser or build validation.
