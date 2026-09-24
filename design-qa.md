# Homepage clarity, routes and verified case-study QA

## Source visual truth

- Hero blur feedback: `design-qa-assets/user-feedback-hero-blur.png`
- Unrelated route-card feedback: `design-qa-assets/user-feedback-route-cards.png`
- Case-interface feedback: `design-qa-assets/user-feedback-case-interface.png`
- Source/implementation contact sheet: `design-qa-assets/case-refresh-comparison.png`
- Verified source photographs: the three user-supplied construction images processed into `src/assets/cases/`.

## Browser-rendered implementation evidence

- Desktop night hero: `qa-redesign/case-refresh/desktop-hero.png`
- Desktop day hero: `qa-redesign/case-refresh/desktop-hero-day.png`
- Desktop project routes: `qa-redesign/case-refresh/desktop-routes.png`
- Desktop verified cases: `qa-redesign/case-refresh/desktop-cases.png`
- Mobile night hero: `qa-redesign/case-refresh/mobile-hero.png`
- Mobile verified cases: `qa-redesign/case-refresh/mobile-cases.png`
- Desktop viewport: 1440 × 900, English, default night and manually switched day.
- Mobile viewport: 390 × 844, English, default night and case-section state.

## Required fidelity surfaces

- Hero: the prior deep blur was reduced to a narrow 5px bottom treatment; day/night images now use controlled contrast and saturation to preserve wing-slat detail.
- Project routes: unrelated generated concept imagery was removed. Four routes now use a disciplined editorial ledger with fixed alignment, route number, clear project logic and a direct private-brief path.
- Case evidence: rejected external precedent images and attributions were removed. The case section uses only the user's verified construction photographs.
- Authenticity: construction photographs received deterministic crop, colour correction, WebP encoding and sharpening only. They remain labelled `Verified construction record` and `Work in progress`.
- Responsive behaviour: the editorial ledger and case-study compositions collapse to readable single-column mobile layouts without hiding the sculpture structure.

## Interaction and implementation checks

- Default hero state is night; the user-controlled day transition completes without layout movement.
- Case-section image motion is limited to subtle scroll-linked scale and copy reveal, with a reduced-motion fallback.
- Deep links to `#projects` and `#cases` scroll after the React page is ready.
- Desktop check: 1440px viewport, 1440px document width, no horizontal overflow.
- Mobile check: 390px viewport, 390px document width, no horizontal overflow.
- Two verified case-study articles were present in both desktop and mobile DOM checks.
- Browser language state was English for the QA capture.
- Browser console: zero errors.
- Production build: `npm run build` completed successfully.

## Findings

- P1 — hero sculpture detail was obscured by a large backdrop blur. Fixed by moving the blur to the lowest 22% of the viewport and reducing it to 5px; the scene and sculpture now remain sharp.
- P1 — route-card imagery did not match the sculpture offer and looked generated. Fixed by replacing the image grid with an evidence-led typographic project ledger.
- P1 — external precedent thumbnails were low quality and did not prove WEIERYANG's capability. Fixed by removing them and introducing verified construction-phase records from the user's own projects.
- P2 — the first site photo contained a large foreground pole. Fixed with an authenticity-preserving crop that keeps the full wing structure, cranes and installation context.
- P2 — case copy could have implied a completed client installation. Fixed with explicit construction-phase labels and delivery-focused descriptions.
- No actionable P0, P1 or P2 findings remain.

## Follow-up polish

- P3 — replace the construction records only when approved completion photography for the same projects becomes available; preserve the current construction evidence as a process layer.
- P3 — exact project name, client and city remain intentionally unpublished until verified facts are provided.

final result: passed
