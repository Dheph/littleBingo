# littleBingo — Agent Context

## Project Type
React 19 + TypeScript + Vite SPA. Deployed to GitHub Pages via GitHub Actions.

## Developer Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check (`tsc -b`) then Vite build |
| `npm run lint` | ESLint (`eslint .`) |
| `npm run preview` | Preview production build locally |

**There is no test script or formatter (Prettier) configured.**

## Build & Deploy

- **Production base path:** `base: '/littleBingo/'` in `vite.config.ts`. This must stay in sync with the GitHub Pages repository name.
- **CI:** `.github/workflows/deploy.yml` runs on push to `main`. It does `npm ci && npm run build` and deploys the `dist/` folder to GitHub Pages.
- `dist/` is gitignored but is pre-built and present in the repo; don't commit it.

## Routing

Uses `HashRouter` (not `BrowserRouter`) in `src/main.tsx` because GitHub Pages is static hosting and cannot handle client-side SPA routes. All routes are hash-based: `/#/`, `/#/setup`, `/#/bingo`.

## Architecture

- **Entrypoint:** `src/main.tsx`
- **Router guard logic:** `src/App.tsx` — `/setup` redirects to `/bingo` if already set up; `/bingo` redirects to `/` if not.
- **State:** Single Zustand store in `src/store/bingoStore.ts`. Persisted to `localStorage` under key `bingo-app-state-v1`.
- **Sound effects:** `src/utils/sounds.ts` uses the Web Audio API directly (no external audio assets). It guards against SSR with `typeof window === 'undefined'`.
- **Theme:** `next-themes` + Chakra UI `defaultSystem`. A custom `BingoTheme` object is stored in Zustand and applied via inline styles/Chakra props.
- **Empty directories:** `src/pages/`, `src/hooks/`, and `src/theme/` exist but contain no files. All components and pages live under `src/components/`.

## TypeScript

- Project references setup: `tsconfig.json` references `tsconfig.app.json` (for `src/`) and `tsconfig.node.json` (for `vite.config.ts`).
- Strict linting flags enabled: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`.
- Do **not** run `tsc` without `-b`; it expects the project references.

## ESLint

Config in `eslint.config.js`. Uses `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`. Only lints `**/*.{ts,tsx}`; `dist/` is ignored.

**⚠️ The CI workflow does NOT run `npm run lint`.** Build-time TypeScript errors are caught, but ESLint errors (including strict react-hooks rules) can slip through and break the production build silently. Always run `npm run lint` locally before pushing.

## Constraints & Gotchas

- No backend. All state is client-side (`localStorage`).
- `canvas-confetti` and `framer-motion` are used for visual effects.
- The app language is Portuguese (`lang="pt-BR"`), but UI strings are hardcoded in Portuguese.
- If you add new routes, remember they must work with `HashRouter` and the `base` path in Vite.
- **Chakra UI v3 is used**, not v2. Props like `bgGradient`, `bgClip="text"`, `gradientFrom`, etc. are v2-only and will cause runtime errors in production. Use inline `style` or standard CSS properties instead.
- **ErrorBoundary:** `src/components/ErrorBoundary.tsx` wraps the app in `main.tsx` to catch runtime errors and display them instead of a blank screen. It also provides a button to clear `localStorage` and reload.
