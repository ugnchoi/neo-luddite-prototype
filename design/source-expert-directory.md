# Source-backed expert directory

Scope: guests can browse/search six supplied tax professionals from the home composer, entry chat header, and AI expert-handoff response. This is a read-only directory, separate from simulated expert account IDs and consultation services. No availability, ratings, likes, booking, or implied AI matching.

Source: [세무사 정보.xlsx](https://docs.google.com/spreadsheets/d/15_t24OJzHLtzRO0OVbwHiD2Rugz_3is5/edit), Sheet1. Drive modified time 2026-10-23T07:17:06.031Z; snapshot imported 2026-11-02. Updates require a new source import and deployment; there is no live Sheets sync. Original workbook is unchanged and is not shipped.

| Name | Name / specialty cells | Profile anchor | Embedded image |
| --- | --- | --- | --- |
| 서유진 | D3 / F3 | B3 | xl/media/image2.png |
| 김재광 | D13 / F13 | B13 | xl/media/image4.png |
| 이란 | D22 / F22 | B22 | xl/media/image6.png |
| 신효정 | D31 / F31 | B31 | xl/media/image7.png |
| 백종호 | D39 / F39 | B39 | xl/media/image10.png |
| 진효근 | D47 / F47 | B47 | xl/media/image11.png |

Portraits are extracted from drawing1.xml anchors and relationships, resized to 360px width and encoded as WebP (quality85). No generative alteration or cropping. Business-card images and contact details are excluded from this browsing scope. The 26-year practical-experience statement for 백종호 is transcribed from F39 and labeled as supplied-source information; the shared 62기 value is not interpreted as experience.

Design: extend the incumbent Luminous system, existing Base UI dialog and Button, Korean font and semantic ds tokens. Preserve chat position and draft while browsing; Escape/close returns focus. Search covers names, the title 세무사, supplied specialties and notes, normalizing NFKC, case and whitespace; no algorithmic ranking. Display source order and clear empty/reset state. No new global design tokens.

Verification: 125 unit tests passed; production entry-live build passed; focused ESLint passed. Browser checks verified six loaded portraits, specialty/name search including whitespace, empty-state reset, Escape focus return, preservation of a chat draft, no backend/Supabase requests during browsing, 390px layout without horizontal overflow, and dark-theme semantic colors. Search wrapper owns the single visible keyboard focus indicator.
