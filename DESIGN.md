# WEIERYANG digital design system

## Direction

WEIERYANG is an art-led international sculpture studio with engineering delivery. The site should feel like a private material-inspection room for hotel and real-estate decision makers: cinematic, quiet, precise, and credible.

This system adapts three references from `VoltAgent/awesome-design-md` without copying any automotive or software brand:

- Tesla: full-viewport photography, minimal interface chrome, one message per screen, and consistent motion timing.
- Bugatti: austere near-black surfaces, generous gallery spacing, wide display type, technical mono labels, and hairline structure.
- Sanity: a dark editorial surface with one restrained coral/copper action signal and technical eyebrow labels.

WEIERYANG keeps its own gold-and-white W mark, copper-red action color, sculpture materials, engineering proof, and commission language.

## Core tokens

```css
:root {
  --bg: #0b0b09;
  --bg-soft: #11110f;
  --surface: #171714;
  --surface-high: #1d1d19;
  --text: #f0eee8;
  --text-soft: #b7b3aa;
  --text-faint: #817e76;
  --line: #34332d;
  --line-strong: #56534a;
  --accent: #b8441e;
  --accent-hover: #cc4b21;
  --display: "Bebas Neue", "Arial Narrow", sans-serif;
  --body: Manrope, Arial, "Noto Sans Arabic", sans-serif;
  --section-space: clamp(100px, 10vw, 170px);
  --motion: 330ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

Use one chromatic action color only. Copper red is for inquiry actions, active route indicators, and small technical signals; it is never decorative wallpaper.

## Typography

- Display: narrow architectural capitals, weight 400, large scale, tight vertical leading.
- Body/UI: Geist Variable with Manrope fallback at 400-800, comfortable line length, 1.55-1.7 line-height.
- Arabic: Noto Sans Arabic with genuine RTL alignment and no condensed Latin display substitution.
- Eyebrows and route numbers: small, tracked, technical labels.
- Use scale, spacing, and tracking for authority. Avoid heavy bold display text, decorative serif styling, and text effects.

## Layout contract

- The hero is full-bleed and at least `100dvh`; photography carries the emotional weight.
- Header, hero route dock, assurance band, and page sections must share named horizontal frame tokens.
- Decorative asymmetry is allowed inside photography. Structural lines, paired cards, text baselines, and CTA positions must remain aligned.
- Project routes use a stable 2×2 desktop grid. Every card shares the same image/content anatomy and CTA baseline. Mobile collapses to one column.
- Major sections use 100-170px breathing room. Avoid dense card walls and nested panels.
- The long inquiry form stays on `/commission/`; the homepage qualifies and routes buyers to it.

## Hero motion

The banner uses a two-layer architectural inspection interaction, not a decorative cursor:

- Subtle image settle on entry.
- The default visible layer is an exact edge-derived drawing of the material desk; the photographic layer stays geometrically aligned above it.
- A pointer- or touch-driven scanning aperture reveals the brighter photographic layer without changing object geometry.
- When interaction stops, the photograph remains at the last inspection point and fades back to the drawing over approximately 1.8 seconds.
- Maximum photographic parallax travel is 12px horizontally and 8px vertically.
- Pointer updates write CSS variables inside `requestAnimationFrame`; they do not update React state.
- Touch drag uses the same reveal interaction; `prefers-reduced-motion` keeps the static drawing layer.
- No looping autoplay, heavy blur, WebGL requirement, or fake 3D sculpture scene.

## Immersive scroll narrative

- The homepage narrative is ordered as site reading, concept drawing, material study, structural review, workshop control, and installation support.
- Six engineering-sheet modules pin as one stage and stack from the bottom with GSAP ScrollTrigger scrubbing.
- Previous sheets remain visible as quiet drawing layers; incoming sheets occupy the active plane.
- Mobile retains pinning and stacking with tighter typography and a longer per-sheet scroll distance.
- Reduced-motion mode renders all sheets as a normal readable vertical sequence.

## Imagery

- Prefer real material samples, drawings, surface tests, workshop evidence, packing, and installation guidance.
- Generated visuals must be labeled as material, concept, or capability studies, never completed client work.
- Review-critical drawings use complete-image framing (`object-fit: contain`).
- Avoid impossible interlocking geometry, fantasy monuments, generic stock teams, and uncontrolled subject cropping.

## Components and states

- Buttons are sharp or barely rounded, with visible hover, pressed, and keyboard focus states.
- Cards are flat editorial fields separated by spacing or hairlines, never generic floating shadows.
- Forms require field validation, real file upload, progress, clear error/success states, and email + WhatsApp follow-up.
- Header and production footer stay consistent across every route.
- All visible navigation, forms, validation, and confirmation copy stay synchronized across EN, AR, ZH, FR, ES, and DE.

## Do not

- Do not mix competing accent colors, gradients, glass cards, generic icons, or large rounded pills.
- Do not let one column cross another row boundary unless the composition is intentionally documented.
- Do not use visual asymmetry to excuse misaligned grid lines or CTA baselines.
- Do not place the long project form in the first viewport.
- Do not publish placeholder endorsements or generated scenes as factual project proof.
