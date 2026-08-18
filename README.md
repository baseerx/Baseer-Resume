# Muhammad Baseer Khan — Interactive Résumé

A single-page résumé / portfolio built with **Vite + React 19 + Tailwind CSS v4**, animated with
**Framer Motion**. Content is transcribed from `BaseerKhan-Resume.pdf`.

## Quick start

```bash
npm install      # once
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve dist/ on http://localhost:4173
```

Node 18+ required (developed on Node 22).

## Editing the content

**Everything you'd normally want to change lives in one file: [`src/data/resume.js`](src/data/resume.js).**

| Export        | Drives                                                          |
| ------------- | --------------------------------------------------------------- |
| `profile`     | Name, title, rotating roles, contact details, summary, photo/PDF paths |
| `stats`       | The four animated counters under the hero                        |
| `highlights`  | The four "what I do" cards in About                              |
| `experience`  | Timeline entries — `type` feeds the Full-time / Contract / Part-time filter |
| `projects`    | Project grid — `category` feeds the filter, `featured` adds the star |
| `skillGroups` | Skill columns and their proficiency meters                       |
| `tools`       | The scrolling tools marquee                                      |
| `education`   | Degree cards                                                     |
| `achievements`| Award cards                                                      |
| `languages`   | Language meters in About                                         |
| `navLinks`    | Nav items — the `id` must match a `<Section id="…">`             |

Icons are referenced by **name** (e.g. `icon: "Brain"`) and resolved from a small map at the top of
each component, so only names already in those maps will render — add to the map to use a new one.

## Assets in `public/`

| File | Purpose |
| --- | --- |
| `profile.png` | Hero portrait — background chroma-keyed out, transparent PNG |
| `avatar.png` | Square crop, used as the Apple touch icon |
| `favicon.png` | 128×128 browser tab icon |
| `Muhammad-Baseer-Khan-Resume.pdf` | Target of every "Download Résumé" button |

To swap the PDF, drop a replacement in `public/` and update `profile.resumeFile`.

## Structure

```
src/
├─ App.jsx                 composition root
├─ index.css               Tailwind v4 theme tokens, keyframes, print styles
├─ data/resume.js          all content
├─ hooks/                  useTheme · useScrollSpy · useMediaQuery
└─ components/
   ├─ Navbar Hero About Experience Projects Skills Education Contact Footer Preloader
   └─ ui/                  Section · Reveal · Counter · SpotlightCard · Background · ScrollProgress · BrandIcons
```

## Design notes

- **Theming** — light/dark driven by a `dark` class on `<html>`, persisted to `localStorage`
  (`mbk-theme`), defaulting to the OS preference. All colours are CSS custom properties registered
  through Tailwind's `@theme inline`, so a single token change restyles the whole site.
- **Motion** — aurora background, cursor spotlight, scroll progress bar, staggered scroll reveals,
  typewriter hero, animated counters and meters, pointer-tracking card spotlights with 3D tilt,
  shared-layout filter pills, and a scroll-linked timeline rail.
- **Reduced motion** — every animation collapses to a plain fade under
  `prefers-reduced-motion: reduce`; the cursor spotlight and tilt disable entirely.
- **Print** — `Ctrl/Cmd+P` produces a clean light-theme document: decorative layers are dropped,
  scroll-reveal opacity is forced back to 1, every experience entry expands, and the proficiency
  meters render at their real values.
- **Responsive** — verified with no horizontal overflow from 390 px upward.

## Deploying

The build is fully static and uses relative asset paths (`base: './'`), so `dist/` can be dropped
onto any static host — Netlify, Vercel, GitHub Pages, IIS, or an S3 bucket — with no further config.
