# Skipper UI for Free

<p align="center"><img src="public/dot-logo.svg" alt="SKIPPER UI FOR FREE" width="520" /></p>

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3-149eca?logo=react)](https://react.dev/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-14.7-black?logo=framer)](https://www.framer.com/motion/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88ce02?logo=greensock)](https://gsap.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186-black?logo=threedotjs)](https://threejs.org/)
[![Components](https://img.shields.io/badge/Components-106%20Verified%20%2B%201%20Local-7c3aed)](#component-inventory)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Live gallery:** [skipper-ui.vercel.app](https://skipper-ui.vercel.app)

An interactive showcase and production-grade component library reconstructing the complete **Skipper UI** catalog. Built with Next.js 15, React 19, Tailwind CSS, Framer Motion, GSAP, and Three.js, this repository provides 106 clean-room reconstructed motion components plus an original locally authored interactive design primitive (`skipper93`), all verified with zero runtime regressions.

Every component is self-contained, fully typed, locally hosted with complete media assets, and instantly extractable into any external React application.

---

## Key Features

- **107 Complete Interactive Primitives:** 106 verified upstream reconstructions spanning modern landing page interactions, micro-interactions, Apple-style dynamic islands, 3D WebGL hero scenes, physics-based gesture fields, and fluid carousels.
- **Standalone Isolated Previews:** Every component has its own dedicated preview route (`/v1/preview/skipper{N}`) rendered without extraneous chrome or dashboard wrappers.
- **Interactive Local Dashboard:** Search, filter by collection/category, switch viewports (Mobile, Tablet, Desktop), inspect props, and view source side-by-side.
- **100% Local Static Media:** Zero external CDN dependencies. All textures, 3D models (`.glb`), sounds (`.mp3`), and background videos (`.mp4`) are stored under `public/`.
- **Zero-Dependency Component Exporter:** Extract any component and its referenced media directly into an external project with a single CLI command.
- **Strict Quality Assurance:** 100% TypeScript strict adherence (zero `any`), clean memory lifecycle unmount teardown, audio autoplay safeguards, and headless Playwright smoke validation.

---

## Quick Start & Local Dashboard

### 1. Prerequisites

- **Node.js:** 22.0.0 or higher
- **Package Manager:** `npm` 10+

### 2. Installation & Development

```bash
# Clone the repository
git clone https://github.com/Sandeep-Hipparagi/Skipper-UI.git
cd Skipper-UI

# Install locked dependencies
npm ci

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Use the search bar to find components by keyword or tech stack.
- Filter by design collections (Navbars, Loaders, Carousels, 3D, Cards, Buttons, Inputs).
- Click any card to launch the **Interactive Drawer** featuring responsive viewport toggles (`375px`, `768px`, `100%`), spec metadata, and direct links to isolated preview routes.

### Add a component to another project with shadcn

Each of the 106 upstream-derived components has a static registry item hosted by this deployment. Run the generated command from the dashboard drawer or use:

```bash
npx shadcn@latest add https://skipper-ui.vercel.app/r/skiper24.json
```

Browse the [registry index](https://skipper-ui.vercel.app/r/index.json). Registry items use media hosted on the same Vercel origin, and the index lists their media URLs. `skipper93` is an original local primitive because the upstream URL returns 404; it remains available in the local catalog and exporter, but is not counted among the 106 upstream registry items.

---

## Component Portability & Future Project Extraction

Every component in `src/components/v1/skipper{N}.tsx` is architected to be portable and self-contained. It only relies on:
1. Standard npm packages declared in `package.json`.
2. The shared utility `@/lib/utils` (`cn()` helper).
3. Static media assets predictably located under `public/`.

### Automated CLI Extraction

We provide an automated extraction utility to copy any component, its dependencies, and referenced static assets into a target project:

```bash
# Export skipper24 to an external application directory
npm run export:component skipper24 --dest ../my-new-app
```

The exporter also accepts the one-p alias: `npm run export:component -- skiper93 --dest ../my-new-app`.

The script will:
1. Analyze `src/components/v1/skipper24.tsx` for local imports and npm packages.
2. Recursively copy the component and any local helper files to the target directory.
3. Automatically rewrite `@/` path aliases to relative imports.
4. Scan the component for referenced `/public` media (images, audio, 3D models) and mirror them to the destination `public/` directory.
5. Print the exact `npm install` command required for the component's dependencies:
   ```bash
   npm install clsx@^2.1.1 framer-motion@^14.7.1 gsap@^3.15.0 react@^19.3.1 tailwind-merge@^3.7.0
   ```

### Manual Extraction

To manually pull a component:
1. Copy `src/components/v1/skipper{N}.tsx` into your project's components folder.
2. Copy `src/lib/utils.ts` (contains `cn()` using `clsx` and `tailwind-merge`).
3. Check the component's imports for required packages (e.g., `framer-motion`, `lucide-react`, `three`).
4. Copy any referenced static assets from `public/` (e.g., `public/skipperv1/` or `public/audio/`) into your project's `public/` directory.

---

## Component Inventory

| Component ID | Component Title | Primary Tech Stack | Upstream Reference |
|---|---|---|---|
| `skipper1` | Anime js scrollbar | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper1) |
| `skipper2` | Dynamic island | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper2) |
| `skipper3` | Apple play button | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper3) |
| `skipper4` | Theme toggle buttons | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper4) |
| `skipper5` | Things drag and scroll | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper5) |
| `skipper6` | Hover members | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper6) |
| `skipper7` | Nike preloader | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper7) |
| `skipper8` | Words preloader | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper8) |
| `skipper9` | Stairs preloader | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper9) |
| `skipper10` | Double stairs preloader | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper10) |
| `skipper11` | Pixel preloader | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper11) |
| `skipper12` | Vercel Liquid simulation | Three.js | [Reference](https://skipper-ui.com/v1/skipper12) |
| `skipper13` | Nike menu | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper13) |
| `skipper14` | Ascii Simulation | Three.js | [Reference](https://skipper-ui.com/v1/skipper14) |
| `skipper15` | Box loading preloader | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper15) |
| `skipper16` | Card stack scroll | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper16) |
| `skipper17` | Card stack with gsap and rotate | GSAP | [Reference](https://skipper-ui.com/v1/skipper17) |
| `skipper18` | Image cursor trail | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper18) |
| `skipper19` | Svg follow scroll | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper19) |
| `skipper20` | UniSwap Country Dialog | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper20) |
| `skipper21` | Family wallet | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper21) |
| `skipper22` | Aave token swap | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper22) |
| `skipper23` | Minimal Card Expand | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper23) |
| `skipper24` | Tik tik color list | GSAP | [Reference](https://skipper-ui.com/v1/skipper24) |
| `skipper25` | Music toggle btn | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper25) |
| `skipper26` | Theme toggle btn | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper26) |
| `skipper27` | Rolling text | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper27) |
| `skipper28` | 3D perspective text | Three.js | [Reference](https://skipper-ui.com/v1/skipper28) |
| `skipper29` | Siena parallax | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper29) |
| `skipper30` | Oliver parallax | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper30) |
| `skipper31` | Text Scroll animation | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper31) |
| `skipper32` | Scroll images reveal 001 | GSAP | [Reference](https://skipper-ui.com/v1/skipper32) |
| `skipper33` | Scroll images reveal 002 | GSAP | [Reference](https://skipper-ui.com/v1/skipper33) |
| `skipper34` | Scroll images reveal 003 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper34) |
| `skipper35` | Hover expand | GSAP | [Reference](https://skipper-ui.com/v1/skipper35) |
| `skipper36` | Interactive3d Hero | Three.js | [Reference](https://skipper-ui.com/v1/skipper36) |
| `skipper37` | Animated number | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper37) |
| `skipper38` | Apple Navbar V001 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper38) |
| `skipper39` | Canvas crowd | GSAP | [Reference](https://skipper-ui.com/v1/skipper39) |
| `skipper40` | CssLink | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper40) |
| `skipper41` | Progressive Blur | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper41) |
| `skipper42` | Animated icons 001 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper42) |
| `skipper43` | Vercel Tooltip | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper43) |
| `skipper44` | Vercel scroll with blur | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper44) |
| `skipper45` | Family Receive button | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper45) |
| `skipper46` | Nextjs gooey menu | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper46) |
| `skipper47` | Perspective carousel | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper47) |
| `skipper48` | Card swipe carousel | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper48) |
| `skipper49` | Inverted perspective carousel | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper49) |
| `skipper50` | Creative carousel 001 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper50) |
| `skipper51` | Creative carousel 002 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper51) |
| `skipper52` | ExpandOnHover | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper52) |
| `skipper53` | ExpandOnHover vertical | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper53) |
| `skipper54` | Shadcn clipPath Carousal | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper54) |
| `skipper55` | Parallax Image | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper55) |
| `skipper56` | Devouring details sign in | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper56) |
| `skipper57` | Vercel navigation bar | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper57) |
| `skipper58` | Text roll navigation | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper58) |
| `skipper59` | Drawing cursor effect | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper59) |
| `skipper60` | Side Scroll Navigation | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper60) |
| `skipper61` | Mouse follow animations | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper61) |
| `skipper62` | Loop animation hook | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper62) |
| `skipper63` | Apple squicircle effect | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper63) |
| `skipper64` | Gooey Effect | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper64) |
| `skipper65` | Breakpoint indicator | React / CSS | [Reference](https://skipper-ui.com/v1/skipper65) |
| `skipper66` | SVG clip path mask | React / CSS | [Reference](https://skipper-ui.com/v1/skipper66) |
| `skipper67` | Video player 001 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper67) |
| `skipper68` | Animated number input | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper68) |
| `skipper69` | Skipper Number flow | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper69) |
| `skipper70` | Text reveal box | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper70) |
| `skipper71` | Image reveal | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper71) |
| `skipper72` | Horizontal Text reveal | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper72) |
| `skipper73` | Infinite canvas | GSAP | [Reference](https://skipper-ui.com/v1/skipper73) |
| `skipper74` | Timeline calendar | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper74) |
| `skipper75` | Apple Navbar V002 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper75) |
| `skipper76` | Apple Feature Block | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper76) |
| `skipper77` | Apple carousel | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper77) |
| `skipper78` | Dia Browser's Carousal | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper78) |
| `skipper79` | Team showcase scroll | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper79) |
| `skipper80` | Projects Showcase | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper80) |
| `skipper81` | AI Input 001 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper81) |
| `skipper82` | AI Input 002 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper82) |
| `skipper83` | AI Input 003 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper83) |
| `skipper84` | AI Input 004 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper84) |
| `skipper85` | AI Input 005 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper85) |
| `skipper86` | Apple Ai gradient | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper86) |
| `skipper87` | Scroll with fade effect | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper87) |
| `skipper88` | 3D Rolling Text on scroll | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper88) |
| `skipper89` | Scroll progress 001 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper89) |
| `skipper90` | Gradient hover cards | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper90) |
| `skipper91` | Video player 002 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper91) |
| `skipper92` | Vercel Command Search | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper92) |
| `skipper93` | Gesture Field - Magnetic Constellation | Framer Motion | [Reference (Upstream 404)](https://skipper-ui.com/v1/skipper93) *(Original Local Primitive)* |
| `skipper94` | Scroll progress 002 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper94) |
| `skipper95` | Scroll progress 003 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper95) |
| `skipper96` | Expandable tabs navigation | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper96) |
| `skipper97` | Video player 003 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper97) |
| `skipper98` | Vertical tooltip menu | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper98) |
| `skipper99` | Animated icons 002 | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper99) |
| `skipper100` | Draggable snap button | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper100) |
| `skipper101` | Custom tooltip | React / CSS | [Reference](https://skipper-ui.com/v1/skipper101) |
| `skipper102` | Debug Pannel | React / CSS | [Reference](https://skipper-ui.com/v1/skipper102) |
| `skipper103` | Bouncy accordion | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper103) |
| `skipper104` | Scroll reveal grid cards | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper104) |
| `skipper105` | Auto Scale input | React / CSS | [Reference](https://skipper-ui.com/v1/skipper105) |
| `skipper106` | Smooth caret input | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper106) |
| `skipper107` | Knockout bracket | Framer Motion | [Reference](https://skipper-ui.com/v1/skipper107) |

---

## Architecture & Verification Methodology

```
Skipper-UI/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app/                    # Next.js 15 App Router
â”‚   â”‚   â”œâ”€â”€ page.tsx            # Main catalog gallery & interactive drawer
â”‚   â”‚   â”œâ”€â”€ v1/[slug]/          # Component specification & inspection view
â”‚   â”‚   â””â”€â”€ v1/preview/[slug]/  # Isolated full-screen component preview
â”‚   â”œâ”€â”€ components/v1/          # 107 self-contained component implementations
â”‚   â””â”€â”€ lib/
â”‚       â”œâ”€â”€ registry.ts         # Typed component registry and dynamic import loaders
â”‚       â”œâ”€â”€ side-by-side-data.json # Catalog metadata (titles, categories, preview URLs)
â”‚       â””â”€â”€ utils.ts            # Class merging utility (clsx + tailwind-merge)
â”œâ”€â”€ public/                     # 100% locally hosted static assets
â”‚   â”œâ”€â”€ skipperv1/              # Per-component images and textures
â”‚   â”œâ”€â”€ thumbnails/             # 107 pre-rendered WebP preview snapshots
â”‚   â”œâ”€â”€ audio/                  # UI sound clips
â”‚   â”œâ”€â”€ videos/                 # Video backgrounds
â”‚   â””â”€â”€ models/                 # 3D assets (.glb, .hdr)
â”œâ”€â”€ scripts/
â”‚   â”œâ”€â”€ export-component.ts     # CLI extraction tool for external codebases
â”‚   â”œâ”€â”€ verify-assets.mjs       # Static asset verification scanner
â”‚   â””â”€â”€ audit-skippers.mjs      # Playwright headless smoke audit engine
â””â”€â”€ rea-skipper-manifest.json   # Deterministic telemetry, audit notes & verification records
```

### Verification Pipeline

1. **Manifest Parity & Coverage:**
   - `./rea-skipper-manifest.json` tracks all 107 local implementations. Exactly **106** are verified clean reconstructions (`"status": "verified"`, `"verification": "pass"`), and **1** (`skipper93`) retains upstream provenance (`"status": "upstream_404"`, `"verification": "not_applicable"`) while recording `"localImplementation": "present"` for its original primitive.
2. **Deterministic Quality Gate:**
   - **Type Checking:** `npm run typecheck` (`tsc --noEmit`) validates complete TypeScript strictness.
   - **Asset Integrity:** `npm run verify:assets` verifies all 182+ local asset paths exist with non-zero byte size.
   - **Production Build:** Next.js 15 builds all static and dynamic routes cleanly with zero SSR mismatches.
   - **Browser Smoke Audit:** `npm run smoke` navigates Chromium across all 107 routes; `npm run test:e2e` checks dashboard interactions, representative previews and registry endpoints.
   - **Unit/Contract Tests:** `npm run test:unit` checks manifest/registry parity, media integrity, SVG identifier collisions and standalone export.
   - **Local E2E Setup:** Build with `npm run build`, start `npm run start` in one terminal, then run `npx playwright test tests/e2e/smoke.spec.ts` in another. Set `PLAYWRIGHT_TEST_BASE_URL` to verify a remote deployment instead.

---

## Continuous Integration & Deployment (GitHub Actions)

`.github/workflows/ci.yml` checks generated registry parity, TypeScript, contract tests, a production build and browser smoke tests on pushes and pull requests to `main`. `.github/workflows/vercel-deployment-check.yml` runs the same browser suite against each successful Vercel deployment URL. Vercel's Git integration performs deployments; Actions verify those deployments.

---

## Deliverables for GitHub Repository Settings

### Repository About Description
> Complete, reverse-engineered reconstruction of the 106 Skipper UI motion components + 1 local primitive. Built with Next.js 15, React 19, Tailwind CSS, Framer Motion, GSAP, and Three.js. Self-contained, fully typed, locally hosted assets, and CLI extractable.

### Recommended Repository Topics
`nextjs`, `react19`, `framer-motion`, `gsap`, `threejs`, `tailwindcss`, `ui-components`, `micro-interactions`, `design-system`, `reverse-engineering`, `component-library`, `typescript`

---

## License

MIT License Â© 2026 Sandeep Hipparagi. See [LICENSE](LICENSE) for full details.
Third-party libraries and asset files belong to their respective authors.
