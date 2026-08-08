# AGENTS.md — PokeReact (Pokedux)

> Instructions for AI coding agents (OpenCode). Read this fully before doing anything.

## Language

- Think/reason and write code + code comments in **English**.
- Write all **answers, explanations, plans and commit messages in SPANISH**.

## Golden rules

- Do **NOT** rewrite the app from scratch and do **NOT** migrate to TypeScript.
- Do **NOT** read framer-motion or other library internals inside `node_modules` — treat libraries as black boxes.
- Follow the existing code style and folder structure.
- Prefer no new dependency unless it clearly pays off — state the bundle cost first.
- Work **one phase at a time**, each on its own git branch, and **commit at the end** with a clear Spanish message.
- After each phase: run `npm run build` + linter (`standard --fix`). No React warnings (keys, useEffect deps).
- Use Plan mode for designing; Build mode for coding/bug-fixing.

## Stack

- React + Vite (dev server on localhost:5173). Redux Toolkit: `slices/pokeState.js`, `slices/thunks.js`, `slices/UI.js`, `store/`.
- react-router-dom, route `/pokemon/:name` -> `pages/PokemonDetail.jsx`.
- framer-motion (installed in Phase 1).
- Persistence: IndexedDB via idb-keyval (`utils/cache.js`), hydrated in `main.jsx` before render.
- Components: PokemonCard, PokemonList, PaginationComponent, Header, Badge, IconType, Spinner, PokemonCardSkeleton, Toggle, PokemonModal.
- Pages: Home.jsx, PokemonDetail.jsx. Helpers: `utils/api.js`, `utils/evolution.js`, `utils/cache.js`.

## Branches (do NOT reimplement existing work)

- `feature/detail-modal` (A) — modal overlay. Was the reference for Phase 1.
- `feature/detail-state` (B) — conditional full-screen via state. Reference only.
- `feature/detail-router` (C) — real routing, working PokemonDetail. Base branch.
- `feature/pokemon-modal` — **current working branch** (descends from cache + router). All phases live here.

## Progress

- [x] **Phase 5 (base) — Cache**: `pokemonCache` in pokeState + persistence (idb-keyval). Check cache before fetch.
- [x] **Phase 1 — Card flies to center as modal** (deterministic FLIP with framer-motion: getBoundingClientRect + x/y/scale). Open + close (X/Esc/overlay), scroll lock, visible fly-back. Commit 7ecb7a7.
- [x] **Phase 2 — "Ver más detalles" link** navigates to `/pokemon/:name`, closes modal. Commit d04a02d.
- [x] **Phase 3 — Detail page + evolution chain**: thunk `fetchEvolutionChain`, chains /pokemon-species -> /evolution-chain, flatten tree (handles branching e.g. Eevee 9 forms), Spanish flavor text, stat bars, abilities, "Volver", spinner + error/retry. Commit 18f664e.
- [x] **Phase 4 — Search**: `searchTerm` + `allPokemonNames` in pokeState, thunk `fetchAllPokemonNames` (/pokemon?limit=100000), persisted in IndexedDB (hydrated in main.jsx), Header search input with 300ms debounce + clear button, client-side case-insensitive filter, empty state, navigates to `/` when searching from another route. Commit 3cb7c83. NOTE: the 20-result cap was removed in Phase 6 (client-side pagination over the filtered subset).
- [x] **Phase 5.1 — Page cache + fetch optimization**: `pageCache` in pokeState, cache-first check before fetching a page, `?page=N` persisted in URL (return from detail restores the exact page without refetch, scroll preserved), per-card fetches skip when `pokemonCache` already has the detail, sprite `<img>` with `loading="lazy"` + `decoding="async"`, AbortController cancels in-flight card fetches when unmounted. Commit 9d346d4.
- [x] **Phase 6 — Filters**: URL is the single source of truth (`?search=&type=fire,flying&gen=1&sort=id&page=N`). New `useFilteredList` hook = pipeline filter (search ∩ type intersection ∩ generation) -> sort (id/name/total-stats) -> paginate client-side over the full subset (20/page). New `FilterBar.jsx`: type chips (multi, with IconType + aria-pressed), generation chips (1-9), sort select, results counter, "Limpiar filtros". `typeCache` + `generationCache` in pokeState, thunks `fetchTypeList`/`fetchGenerationList` (cache-first), persisted in IndexedDB + hydrated in main.jsx. Home hydrates Redux from URL params on mount/change. `usePagination` now reads/writes `?page=N` and merges with other params (no longer resets). Sort by stat only uses already-cached pokemon (uncached go last, no mass fetches). Modal "Ver más detalles" and Detail "Volver" preserve the full query string. Commit 0e2f8a4.
- [ ] **Phase 7 — Extras**

## Design system (applied, in master)

- Centralised type map `src/constants/types.js` (base color + derived `-700` dark variant for badge contrast + Essentiarum letter) — deduplicates 4 copies.
- Tokens in `tailwind.config.cjs`: `brand` (50-700), `surface`/`bg`/`line`/`muted`/`text`, radius sm/md/lg (8/12/16px), one shadow family (sm/md/lg), type scale (`caption/label/h2/h1/display`).
- Single accent brand-500: Pokémon name `text-gray-900` (+ `dark:text-gray-100`) in grid/modal/detail; stat bars, links, buttons in `brand`; type only tints card bg + badges.
- `Card` primitive (`rounded-lg shadow-md bg-surface dark:bg-gray-800`, `as` prop, forwardRef) used in grid, modal, detail blocks and evolution line; no border+shadow combined; active evolution card = Card + `ring-2 ring-brand-500`.
- `StatBlock` shared by modal (`layout="list"`) and detail (`layout="grid"` 2x3) — grid layout ready for the detail dashboard redesign.
- Badges: `bg tipo/15` + `tipo-700` text (WCAG AA light) with CSS-var dark variant; favorite heart `brand-500` filled / muted outline; "Solo favoritos" chip in brand. "Limpiar filtros" keeps red (reset affordance).

## Known notes / decisions

- Search text filtering is **100% client-side** against `allPokemonNames` (already in memory) -> typing does NOT consume network data. The 300ms debounce only reduces React re-renders.
- BUT network requests DO appear while typing because each rendered `PokemonCard` fetches its own detail/sprite on mount. To be fixed in Phase 5.1 (cache check per card + lazy images).
- Pages were not cached: returning from `/pokemon/:name` refetched the page and reset to page 1. To be fixed in Phase 5.1 (pageCache + `?page=N` in URL).

## Remaining phases

### Phase 7 — Extra improvements (iterative, ask before each unless noted)

- **Favorites (persisted)**: `favorites: string[]` in pokeState with `toggleFavorite`, persisted in IndexedDB + hydrated. Heart button on PokemonCard and inside PokemonModal (stopPropagation so it doesn't open the modal; filled/outline; aria-pressed, keyboard focusable). "Solo favoritos" chip in FilterBar/Header, combines with search/filters, reflected in URL (`?fav=1`), empty state "Aún no tienes favoritos".
- Prefetch-on-hover for instant modal open.
- Reuse PokemonCardSkeleton during fetch.
- Accessibility: aria-expanded, keyboard Enter/Space, visible focus.
- Persist theme (Toggle.jsx).
- Stats radar chart, type-effectiveness table, list virtualization (react-window), image lazy loading, retry/error boundary.

## Definition of done (per phase)

- Build clean + linter OK, no React warnings.
- Tested in dev server; relevant state persists after reload where applicable.
- Committed on its own branch with a clear Spanish message.
