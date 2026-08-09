# AGENTS.md — PokeReact (Pokedux)

> Instructions for AI coding agents (OpenCode). Read this fully before doing anything.

## Language

- Think/reason and write code + code comments in **English**.
- Write all **answers, explanations, plans and commit messages in SPANISH**.

## Golden rules

- One phase **per branch**, **one commit per step**. Each phase lives on its own git branch; commit at the end with a clear Spanish message.
- ALWAYS run `pnpm linter` after each step.
- `pnpm build` is REQUIRED for changes to logic, imports/exports, new/renamed/moved files,
  hooks, components, routes, state/thunks, config, or dependencies (anything that can break
  module resolution or bundling).
- `pnpm build` is OPTIONAL for purely visual/styling changes (Tailwind classes, tokens, spacing,
  colors, copy) that add/remove no imports and touch no logic — linter + a dev visual check is
  enough.
- When in doubt, run `pnpm build`.
- No React warnings (keys, useEffect deps).
- **NEVER** `git commit --no-verify`; always respect husky + lint-staged (prettier + standard run on staged files).
- Do **NOT** read framer-motion or other library internals inside `node_modules` — treat libraries as black boxes.
- Do **NOT** migrate the app to TypeScript and do **NOT** rewrite it from scratch.
- Follow the existing code style and folder structure.
- Use **ONLY** existing design-system tokens (`brand`, `surface`, `bg`, `line`, `muted`, `text`) — no new colors. See "Design system" below.
- Prefer no new dependency unless it clearly pays off — state the bundle cost first.
- Use Plan mode for designing; Build mode for coding/bug-fixing.

## Developer commands

- `pnpm dev` — Vite dev server on **localhost:5173**.
- `pnpm build` — Vite production build (run after every step).
- `pnpm linter` — **standard --fix** (repo uses `standard`, not eslint directly). The script is `linter`, not `lint`.
- `pnpm fmt` — Prettier write-all (pre-commit runs prettier + standard on staged files only).
- `pnpm preview` — serve the built bundle.
- There is **no test suite** and **no typecheck** script — do not look for jest/vitest/tsc.
- Package manager: **pnpm** (lockfile: `pnpm-lock.yaml`). Do **NOT** use npm or yarn.
- Config: Vite plugin-react only (`vite.config.js`); ESLint via `standard`'s eslintrc with `space-before-function-paren: off`; Tailwind + PostCSS (`.cjs`); husky `prepare` hook installs lint-staged.

## Stack

- React 18 + Vite 3. Redux Toolkit: `slices/pokeState.js`, `slices/thunks.js`, `slices/UI.js`, `slices/index.js`; store in `store/index.js` (reducers `pokeState` + `UI`).
- react-router-dom **v7**, nested routes: `/` -> `Layout` (Header + `<Outlet/>` + Footer) per `App.jsx`; `/pokemon/:name` -> `pages/PokemonDetail.jsx`.
- framer-motion (modal FLIP animation `PokemonCard` <-> `PokemonModal`).
- Pagination via `react-headless-pagination` (`PaginationComponent.jsx`).
- Persistence: IndexedDB via idb-keyval (`utils/cache.js`), hydrated in `main.jsx` **before render** (cache, names, typeCache, generationCache, favorites).

## Architecture — what an agent would miss

- **URL is the single source of truth** for filters: `?search=&type=fire,flying&gen=1&sort=id&page=N&fav=1`. Home hydrates Redux from URL params on mount/change via `useFilteredList`.
- Retrieval cache hierarchy: `pokemonCache` (per-pokemon detail) + `pageCache` (page results) + `allPokemonNames`, `typeCache`, `generationCache`, `favorites` — all cache-first; thunks skip fetch when cached. Per-card fetches skip when `pokemonCache` already has the detail; sprite `<img>` uses `loading="lazy"` + `decoding="async"`.
- **Dead code TODO**: `slices/thunks.js:14` — `fetchPokemonDataList` is marked "dead code tras Fase 6, limpiar al final". Do not rely on it; clean up only at the final polish step.
- `useAdjacentPokemon` derives prev/next from the filtered list in Redux (populated by Home). On a direct URL visit with filter params where Home never mounted, it gracefully falls back to absolute dex order, ignoring URL filter params — accepted, deferred to Step 4 polish.
- Sprite `<img>` lazy + async; AbortController cancels in-flight card fetches on unmount.

## Component & hook inventory

- Components: `Card` (primitive, `as` + forwardRef), `ContentPage`, `ErrorBoundary`, `FavoriteButton`, `FilterBar`, `Footer`, `Header`, `Badge`, `IconType`, `Layout`, `PaginationComponent`, `PokemonCard`, `PokemonCardSkeleton`, `PokemonList`, `PokemonModal`, `Spinner`, `StatBlock`, `Toggle`.
- Hooks: `useAdjacentPokemon`, `useData`, `useFilteredList` (filter -> sort -> paginate pipeline), `usePagination` (reads/writes `?page=N`, merges with other params), `usePokemonList`.
- Pages: `Home.jsx`, `PokemonDetail.jsx`. Helpers: `utils/api.js`, `utils/evolution.js`, `utils/cache.js`. Constants: `constants/types.js` (type color map), `constants/pokemon.js` (`MAX_POKEMON_ID`).

## Branches (do NOT reimplement existing work)

- `master` — stable baseline (remote default).
- `feature/pokemon-modal` — Phases 1-6 lived here (modal FLIP, "Ver más detalles", evolution chain, search, page cache, filters).
- `feature/detail-fullview` — **current working branch** (descends from design-system + pokemon-modal). Redesigns `PokemonDetail` as a full dashboard.
- Other branches (reference only): `feature/detail-modal` (modal overlay), `feature/detail-state` (conditional full-screen via state), `feature/detail-router` (real routing), `feature/cache-persistence`, `feature/design-system`, `feature/expandable-card`, `modernizacion`.

## Design system (applied, in master)

- Centralised type map `src/constants/types.js` (base color + derived `-700` dark variant for badge contrast + Essentiarum letter) — deduplicates 4 copies.
- Tokens in `tailwind.config.cjs`: `brand` (50-700), `surface`/`bg`/`line`/`muted`/`text`, radius sm/md/lg (8/12/16px), one shadow family (sm/md/lg), type scale (`caption/label/h2/h1/display`). `darkMode: 'class'`.
- Single accent brand-500: Pokémon name `text-gray-900` (+ `dark:text-gray-100`) in grid/modal/detail; stat bars, links, buttons in `brand`; type only tints card bg + badges.
- `Card` primitive (`rounded-lg shadow-md bg-surface dark:bg-gray-800`, `as` prop, forwardRef) used in grid, modal, detail blocks and evolution line; no border+shadow combined; active evolution card = Card + `ring-2 ring-brand-500`.
- `StatBlock` shared by modal (`layout="list"`) and detail (`layout="grid"` 2x3).
- Badges: `bg tipo/15` + `tipo-700` text (WCAG AA light) with CSS-var dark variant; favorite heart `brand-500` filled / muted outline; "Solo favoritos" chip in brand. "Limpiar filtros" keeps red (reset affordance).

## Progress

- [x] **Phase 1 — Card flies to center as modal** (deterministic FLIP with framer-motion: getBoundingClientRect + x/y/scale). Open + close (X/Esc/overlay), scroll lock, visible fly-back. Commit 7ecb7a7.
- [x] **Phase 2 — "Ver más detalles" link** navigates to `/pokemon/:name`, closes modal. Commit d04a02d.
- [x] **Phase 3 — Detail page + evolution chain**: thunk `fetchEvolutionChain`, chains /pokemon-species -> /evolution-chain, flatten tree (handles branching e.g. Eevee 9 forms), Spanish flavor text, stat bars, abilities, "Volver", spinner + error/retry. Commit 18f664e.
- [x] **Phase 4 — Search**: `searchTerm` + `allPokemonNames` in pokeState, thunk `fetchAllPokemonNames` (`/pokemon?limit=100000`), persisted in IndexedDB (hydrated in main.jsx), Header search input with 300ms debounce + clear button, client-side case-insensitive filter, empty state, navigates to `/` when searching from another route. Commit 3cb7c83. Search text filtering is 100% client-side against `allPokemonNames` (already in memory) — typing does NOT consume network data; the 300ms debounce only reduces re-renders.
- [x] **Phase 5 / 5.1 — Cache**: `pokemonCache` + `pageCache` in pokeState, cache-first check before fetching a page, `?page=N` persisted in URL (return from detail restores the exact page without refetch, scroll preserved), per-card fetches skip when cached, sprite lazy+async, AbortController on unmount. Commit 9d346d4.
- [x] **Phase 6 — Filters**: `useFilteredList` hook = pipeline filter (search ∩ type intersection ∩ generation) -> sort (id/name/total-stats) -> paginate client-side over the full subset (20/page). `FilterBar.jsx`: type chips (multi, IconType + aria-pressed), generation chips (1-9), sort select, results counter, "Limpiar filtros". `typeCache` + `generationCache` in pokeState, thunks `fetchTypeList`/`fetchGenerationList` (cache-first), persisted in IndexedDB + hydrated. `usePagination` reads/writes `?page=N` and merges with other params. Sort by stat only uses already-cached pokemon (uncached go last, no mass fetches). Modal "Ver más detalles" and Detail "Volver" preserve the full query string. Commit 0e2f8a4.
- [x] **Favorites (persisted)**: `favorites: string[]` in pokeState with `toggleFavorite`, persisted in IndexedDB + hydrated (`loadFavorites`/`hydrateFavorites` in main.jsx). `FavoriteButton.jsx` on PokemonCard and inside PokemonModal (stopPropagation on click/keydown so it never opens the modal; filled/outline; aria-pressed, focusable). "Solo favoritos" chip in FilterBar, combines with search/filters, reflected in URL (`?fav=1`). Commit bdfe276.
- [x] **Design system**: tokens, Card primitive, unified brand-500 accent, AA badges, shared StatBlock. Commits 9ee32bd..d321599, recorded in docs 5fd421c.

## Project state (as of commit 96eeaef, branch `feature/detail-fullview`)

Redesigning `PokemonDetail` as a full dashboard view. Completed so far on this branch:

- **Dashboard skeleton** (b4f0641): hero + responsive 3-column grid (Pokédex Entry, Stats 2x3 via `StatBlock layout="grid"`, Línea evolutiva) reusing `Card` + `StatBlock`. `Layout` uses `main flex min-h-screen` + `flex-1` content.
- **Balanced hero** (c48af65): sprite as protagonist, display name, type-based gradient, sticky footer.
- **Symmetric hero** (3e4afd2): lateral chevrons, centered content, `FavoriteButton` top-right.
- **Hero radial halo** (c8dc3a5): symmetric radial background behind the sprite.
- **Prev/next navigation** (96eeaef): in the hero via `useAdjacentPokemon` — index relative to the filtered list, with fallback to absolute dex id when the filtered list is empty.

Pending on `feature/detail-fullview`:

- **B3 — keyboard + a11y**: keyboard activation for prev/next, aria-expanded/aria-label, visible focus rings.
- **Step 2 — vertical evolution line with branch support**: evolution chain rendered vertically, handling branching (e.g. Eevee) — currently horizontal.
- **Step 3 — fit-on-screen polish**: ensure the dashboard fits without excessive scroll on common viewports.
- **Step 4 — app-wide polish**: persist theme (`Toggle.jsx`), honor URL filter params on direct detail visits (currently `useAdjacentPokemon` ignores them), misc cleanup.

## Remaining ideas (deferred)

- Prefetch-on-hover for instant modal open.
- Reuse `PokemonCardSkeleton` during fetch in detail.
- Stats radar chart, type-effectiveness table.
- List virtualization (`react-window`).
- Retry/error boundary refinements (ErrorBoundary exists since 3459f08).

## Definition of done (per phase)

- Build clean (`pnpm build`) + linter OK (`pnpm linter`), no React warnings.
- Tested in dev server; relevant state persists after reload where applicable.
- Committed on its own branch with a clear Spanish message. Never `--no-verify`.
