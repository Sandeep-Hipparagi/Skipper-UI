# Contributing to Skipper UI

Thank you for contributing to Skipper UI! This project is a reverse-engineered, clean-room reconstruction and interactive showcase of modern web micro-interactions, motion physics, and design engineering primitives.

To maintain production stability, accessibility, and architectural portability across all components, please follow these guidelines.

---

## Development Setup

- **Runtime:** Node.js 22.x or newer and `npm` 10+.
- **Install dependencies:**
  ```bash
  npm ci
  ```
- **Local Dev Server:**
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) to inspect the catalog and interactive drawer.

---

## Architectural Principles & Style Conventions

1. **Self-Contained Portability:**
   - Keep all component implementations strictly isolated in `src/components/v1/skipper{N}.tsx`.
   - Components may only depend on declared packages in `package.json`, `@/lib/utils` (`cn`), and statically hosted local media in `public/`.
   - Never introduce circular dependencies between components or depend on private machine paths.

2. **TypeScript Strictness:**
   - No implicit `any`, no untyped props, and zero type errors.
   - Run `npm run typecheck` (`tsc --noEmit`) before submitting changes.

3. **Asset Hygiene:**
   - All static assets must reside locally under predictable `public/` directories:
     - `public/skipperv1/` for component-specific assets
     - `public/thumbnails/` for WebP preview snapshots
     - `public/audio/` for sound effects
     - `public/videos/` for video backgrounds
     - `public/models/` for 3D meshes and HDRI maps
   - Never reference external CDNs or unhosted remote media.

4. **Lifecycle & Motion Cleanup:**
   - Every `requestAnimationFrame`, `setTimeout`, `setInterval`, `addEventListener`, or WebGL/Three.js render loop **must** have clean unmount teardown in `useEffect` / `useLayoutEffect`.
   - Guard against audio autoplay restrictions by wrapping `.play()` in `.catch(() => {})`.

---

## Verification Pipeline

Before opening a pull request, run the complete pre-flight quality gate locally:

```bash
# 1. Run unit and manifest contract tests
npm test

# 2. Strict TypeScript typechecking
npm run typecheck

# 3. Verify all referenced local static assets exist
npm run verify:assets

# 4. Production Next.js build
NODE_OPTIONS="--max-old-space-size=8192" npm run build

# 5. Headless browser smoke audit across all routes
npm run start &
npm run smoke
```

---

## Issue Reports & Pull Requests

- **Issue Reports:**
  - Specify the component slug (e.g., `skipper42`).
  - Include browser name, OS version, and exact reproduction steps.
  - Describe the expected vs. observed behavior, attaching console error logs if any.
- **Pull Requests:**
  - Keep PRs focused on a single component or utility improvement.
  - Describe the motion physics, accessibility, or lifecycle improvements made.
  - Confirm all 5 verification steps passed.
