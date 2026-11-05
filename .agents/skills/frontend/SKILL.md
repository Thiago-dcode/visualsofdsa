---

name: frontend
description: >
Frontend rules for the visualsofdsa Next.js app: components, routes, styling with the
globals.css tokens, animations, and UX. Use when working in src/app, src/components,
src/entities (components and hooks), src/context, or src/hooks. Also triggers whenever
the user asks to design, review, audit, or build any page, component, visualization
control, or UI. Always use this skill for front-end work.
---

# Frontend Rules (Next.js + UX)

---

## 1. UX Priorities

**Users first.** The visualization is the product, so every control must make it easier to watch, understand and replay an algorithm.

- **Cognitive load**: one thing to learn per control. Labels say what the action does (`Play`, `Pause`, `Step forward`), not how it works internally.
- **Feedback**: every action gets an immediate response (pressed state, a running indicator, a toast when something was saved or failed).
- **Visible state**: the user should always see whether the animation is running, paused, muted, or finished.
- **Empty and error states**: say what happened and what to do next.
- **Learning tone**: short, plain, encouraging copy. No jargon the reader hasn't met yet.

---

## 2. Visual Language

- **Chrome stays quiet.** Nav, page headers and control panels use neutral tokens. The visualization carries the color.
- **Color has meaning.** When the visualizer colors elements (comparing, swapping, found, visited), use the palette consistently and never as the only signal. Pair color with a label, outline, icon or position change.
- **Breathe.** Give the visualization room. Prefer padding and gaps over squeezing more controls into view.
- **One focal point per view**: the visualization. One primary action (usually Play or the next step).

### Tokens

All colors, radii, and spacing come from `src/app/globals.css`. Never hardcode hex or rgb in components.

| Purpose               | Use                                                                 |
| --------------------- | ------------------------------------------------------------------- |
| Page background       | `bg-background`                                                     |
| Card / raised surface | `bg-card`, `text-card-foreground`                                   |
| Primary text          | `text-foreground`                                                   |
| Secondary text        | `text-muted-foreground`, `bg-muted`                                 |
| Primary action        | `bg-primary`, `text-primary-foreground`                             |
| Secondary action      | `bg-secondary`, `text-secondary-foreground`                         |
| Destructive action    | `bg-destructive`, `text-destructive-foreground`                     |
| Borders and focus     | `border-border`, `ring-ring`                                        |
| App palette           | `bg-app-*`, `text-app-*` (e.g. `app-bauhaus-blue`, `app-off-black`) |

- Dark mode is class-based (`.dark`). Tokens remap automatically. Check both themes for every new surface.
- Use `cn()`-style merging (`clsx` + `tailwind-merge`) when a class can be overridden.
- Use `class-variance-authority` for component variants, following `src/components/ui`.

---

## 3. Layout & Responsiveness

- **Mobile first.** Write the base styles for phones, then add `min-width` breakpoints: `phone` (480), `tablet` (860), `laptop` (1024), `desktop` (1440), `tv` (1800).
- **No horizontal page scroll** at any breakpoint. Wide visualizations scroll inside their own container and say so.
- **Touch targets** are at least 44×44px.
- **Stack before shrinking.** On small screens, stack the visualization above the controls. Do not shrink type or hit areas to fit.
- **Above the fold**: the title and the visualization (or its first step) are visible without scrolling on desktop.
- Spacing: use the Tailwind scale (4px grid). Default upward: `gap-4`, `gap-6`, `py-8`, `py-12` before smaller values.

---

## 4. Typography

- Body text at least 16px with a 1.5–1.7 line height.
- Two typefaces at most: heading and body. Fonts are loaded in `layout.tsx` with `next/font` (Inter). Reuse those variables; don't load another font.
- Clear hierarchy: H1 → H2 → H3, never skip levels. One H1 per page.
- Body line length 60–80 characters.
- Contrast at least 4.5:1 for body text and 3:1 for large text (WCAG AA).

---

## 5. Components & Server/Client Boundaries

- **Server Components by default.** Add `'use client'` only where the component uses state, effects, event handlers, browser APIs, or a client-only library (Radix, the animation loop, `sonner`).
- Never add `'use client'` to a parent just to satisfy one child. Extract the interactive part into its own client component.
- **Thin pages.** Routes compose; logic lives in `src/entities/*/classes` or hooks.
- **Images** use `next/image` with explicit `width`/`height` (or `fill` + `sizes` inside a sized parent). Prefer WebP or AVIF.
- **Animations** run through the existing hooks (`useAnimation`, `useSpeed`, `useOnScreen`) and the pause/mute contexts. Do not start a second timer loop beside them.
- **Motion and sound**:
  - Respect `prefers-reduced-motion`: reduce or replace large motion (slides, flashes) when it is set. The pause and step controls must still work.
  - Sound must stay controllable through the mute context and default to what the mute context sets.
- **Layout stability (CLS)**: reserve space for the visualization canvas and loaders so the page doesn't jump when data arrives.
- **Performance targets**: LCP under 2.5s, CLS under 0.1, INP under 200ms.

---

## 6. Accessibility

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`, real `<button>` for actions.
- Every image has `alt` text (decorative: `alt=""`).
- Full keyboard use: Tab order matches the reading order; Enter and Space activate buttons; Escape closes dialogs and popovers.
- Visible focus rings on every interactive element (`ring-ring`).
- The visualization needs a text alternative: a step description or an `aria-live` region that announces the current operation when it changes. Don't announce every animation frame.
- Use ARIA only when native HTML can't express the role. Radix primitives already handle most of it; keep their props.
- See `accessibility` for the full WCAG 2.2 checklist.

---

## 7. Forms & Inputs

- Labels are always visible. Placeholders never replace labels.
- Validate on blur, not only on submit.
- Use the right `type` (`number`, `text`) and `inputMode` for numeric entry (array sizes, values, speeds).
- Error messages say what is wrong and how to fix it, e.g. "Enter a whole number between 1 and 50."

---

## 8. Navigation & Wayfinding

- The user always knows where they are: active nav state, a page title that names the structure or algorithm.
- Primary nav stays short and in the same place on every page.
- URLs reflect the hierarchy: `/algorithms/<category>/<item>`, `/data-structures/<category>/<item>`.

---

## 9. Content & Microcopy

- Short paragraphs (3–5 lines). Use subheadings for longer explanations.
- Plain language, no jargon without a one-line definition.
- Loading states name what is loading. Empty states give one next step.
- Link text describes the destination. Never "click here".

---

## 10. SEO Foundations (public pages)

- Use `appMetadata` from `src/lib/metadata.ts` for titles and descriptions. Each page sets its own `title` and `description`.
- Canonical URL on every public page. `sitemap.ts` lists the visualizer pages. `public/robots.txt` stays accurate.
- Structured data (JSON-LD) escapes `<`: `JSON.stringify(data).replace(/</g, "\\u003c")`.
- See `marketing-seo-ux` for the full SEO checklist.

---

## 11. Clean Code

- **Naming**: domain-based and specific (`binary-search-tree/useBinarySearchTreeAnimation.ts` over `utils.ts`).
- **Boundaries**: follow `architecture`. Never import `src/app` from `src/entities`.
- Match the surrounding code's comment density and idioms.

---

## Quick Audit Checklist

```
[ ] Body text at least 16px with 4.5:1 contrast
[ ] The visualization is the clear focal point; controls are secondary
[ ] Play, pause, step and mute states are visible and keyboard-operable
[ ] Works without a mouse; focus is visible
[ ] Reduced motion is respected; the animation can be paused
[ ] Current operation is announced for assistive tech, not every frame
[ ] Colors are paired with labels or shape changes
[ ] No hardcoded hex/rgb; tokens from globals.css
[ ] Checked in light and dark mode
[ ] No horizontal page scroll at phone width
[ ] 'use client' only on components that need it
[ ] Images use next/image with explicit sizes
[ ] Error and empty states say what to do next
```

---

## Output Format

When proposing or reviewing UI:

1. **Structure first**: what the user sees first and what they do next.
2. **Apply tokens and spacing**: from `globals.css` and the Tailwind scale.
3. **Add states**: hover, focus, active, disabled, loading, empty, error, reduced motion.
4. **Test mentally**: keyboard only, phone width, dark mode, slow network, a long-running animation.
5. **Note tradeoffs** when a decision gives up one principle for another.
