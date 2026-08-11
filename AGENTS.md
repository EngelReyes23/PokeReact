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
- Persistence: IndexedDB via idb-keyval (`utils/cache.js`), hydrated in `main.jsx` **before render** (cache, names, typeCache, generationCache, favorites, typeRelationsCache).

## Architecture — what an agent would miss

- **URL is the single source of truth** for filters: `?search=&type=fire,flying&gen=1&sort=id&page=N&fav=1`. Home hydrates Redux from URL params on mount/change via `useFilteredList`.
- Retrieval cache hierarchy: `pokemonCache` (per-pokemon detail) + `pageCache` (page results) + `allPokemonNames`, `typeCache`, `generationCache`, `favorites`, `typeRelationsCache` (defensive type relations) — all cache-first; thunks skip fetch when cached. Per-card fetches skip when `pokemonCache` already has the detail; sprite `<img>` uses `loading="lazy"` + `decoding="async"`.
- **Dead code TODO**: `slices/thunks.js:14` — `fetchPokemonDataList` is marked "dead code tras Fase 6, limpiar al final". Do not rely on it; clean up only at the final polish step.
- `useAdjacentPokemon` derives prev/next from the filtered list in Redux (populated by Home). On a direct URL visit with filter params where Home never mounted, it gracefully falls back to absolute dex order, ignoring URL filter params — accepted, deferred to Step 4 polish.
- Sprite `<img>` lazy + async; AbortController cancels in-flight card fetches on unmount.

## PokemonDetail tabs & appearance

- **URL-driven tabs**: `PokemonDetail` has four tabs — `overview`, `stats`, `evolution`, `moves` — stored in the `tab` query parameter (`DetailTabs.jsx`).
- A missing or invalid `tab` value renders Overview.
- Changing tabs preserves every other URL parameter; explicit tab clicks use normal browser history, so Back/Forward works.
- Tabs intentionally do **NOT** implement custom ArrowLeft/ArrowRight navigation. Every tab button is reachable through the normal Tab key and uses native Enter/Space button activation.
- The global Pokémon previous/next keyboard listener ignores focus inside the `[role="tablist"]`.
- **Normal/Shiny selector**: `PokemonAppearanceToggle.jsx` renders a persistent segmented control in the hero. Appearance is local state in `PokemonDetail` — **not** stored in Redux or IndexedDB.
- **Sprite resolution** lives in `src/utils/sprites.js`.
  - Normal fallback order: `official-artwork.front_default` → `home.front_default` → `front_default` → application fallback.
  - Shiny fallback order: `official-artwork.front_shiny` → `home.front_shiny` → `front_shiny` → resolved normal sprite.
- Shiny stays selected when changing tabs or navigating to another Pokémon that has a valid shiny sprite. It falls back to Normal only after a successfully loaded target Pokémon has no available shiny source.

## Panel architecture (`PokemonDetail`)

- `DetailTabs.jsx`: tab shell + URL interaction.
- `PokemonAppearanceToggle.jsx`: Normal/Shiny segmented control.
- `PokemonDetailPanels.jsx`: panel presentation (Overview, Stats, Evolution & Forms, Moves).
- `PokemonDetail.jsx`: routing, loading orchestration, hero, navigation, appearance, and theme.

Panel contents:

- **Overview**: English Pokédex Entry, Category, Height, Weight, Base Catch Rate, Habitat, Egg Groups, Regular/Hidden Abilities, and defensive Type Matchups. See "Phase 2 — Expanded Overview".
- **Stats**: existing `StatBlock`.
- **Evolution & Forms**: existing `EvolutionTree` + future "Mega & Special Forms" placeholder.
- **Moves**: future Moves placeholder.

Base Pokémon loading and evolution loading are independent. An evolution-fetch failure affects only the Evolution & Forms panel and does not block the hero, Overview, Stats, tabs, Normal/Shiny, or navigation. No Forms or Moves fetching exists yet.

## Component & hook inventory

- Components: `Card` (primitive, `as` + forwardRef), `ContentPage`, `DetailTabs`, `ErrorBoundary`, `FavoriteButton`, `FilterBar`, `Footer`, `Header`, `Badge`, `IconType`, `Layout`, `PaginationComponent`, `PokemonAppearanceToggle`, `PokemonCard`, `PokemonCardSkeleton`, `PokemonDetailPanels`, `PokemonList`, `PokemonModal`, `Spinner`, `StatBlock`, `Toggle`, `TypeMatchups`.
- Hooks: `useAdjacentPokemon`, `useData`, `useFilteredList` (filter -> sort -> paginate pipeline), `usePagination` (reads/writes `?page=N`, merges with other params), `usePokemonList`.
- Pages: `Home.jsx`, `PokemonDetail.jsx`. Helpers: `utils/api.js`, `utils/evolution.js`, `utils/sprites.js`, `utils/cache.js`, `utils/pokemonDetails.js`, `utils/typeMatchups.js`. Constants: `constants/types.js` (type color map), `constants/pokemon.js` (`MAX_POKEMON_ID`).

## Branches (do NOT reimplement existing work)

- `master` — stable baseline (remote default).
- `feature/pokemon-modal` — Phases 1-6 lived here (modal FLIP, "Ver más detalles", evolution chain, search, page cache, filters).
- `feature/detail-fullview` — descended from design-system + pokemon-modal. Redesigned `PokemonDetail` as a full themed dashboard.
- `feature/detail-tabs-shiny` — Phase 1 (URL-driven tabs + Normal/Shiny) lived here.
- `feature/detail-expanded-overview` — **current working branch**. Adds the Phase 2 Expanded Overview (helpers, type-relation data layer, orchestration, final UI).
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
- [x] **Detail tabs + Normal/Shiny (Fase 1)** (`feature/detail-tabs-shiny`): URL-driven `DetailTabs` (overview/stats/evolution/moves), accessible tab buttons with native activation, global arrow-listener ignores the tablist, persistent `PokemonAppearanceToggle`, `src/utils/sprites.js` resolver, content redistributed into `PokemonDetailPanels`, and independent evolution loading/error. Commits e18b1a1, ed587aa, db01340.
- [x] **Phase 2 — Expanded Overview (Fase 2)** (`feature/detail-expanded-overview`): English Pokédex Entry, Category, Height/Weight (métrico), Base Catch Rate, Habitat, Egg Groups, Regular/Hidden Abilities y Type Matchups defensivos (4×/2×/½×/¼×/0×). Helpers puros `src/utils/pokemonDetails.js` + `src/utils/typeMatchups.js`; capa de datos `typeRelationsCache` (Redux + IndexedDB) con `fetchTypeRelations` cache-first y deduplicación; orquestación route-safe en `PokemonDetail` con token de secuencia; UI final en `PokemonDetailPanels.jsx` + `TypeMatchups.jsx`. Commits 8d1fcfd, d4187c4, d161cc7, 339923d.

## Project state (as of commit 339923d, branch `feature/detail-expanded-overview`)

Phase 1 (URL-driven tabs + Normal/Shiny) and Phase 2 (Expanded Overview) are complete and
committed on this branch. The detail Overview now shows English Pokédex Entry, biological data,
regular/hidden abilities, and defensive Type Matchups. See "Phase 2 — Expanded Overview" below.

Dashboard history on the preceding `feature/detail-fullview` branch (reference):

- **Dashboard skeleton** (b4f0641): hero + responsive 3-column grid (Pokédex Entry, Stats 2x3 via `StatBlock layout="grid"`, Línea evolutiva) reusing `Card` + `StatBlock`. `Layout` uses `main flex min-h-screen` + `flex-1` content.
- **Balanced hero** (c48af65): sprite as protagonist, display name, type-based gradient, sticky footer.
- **Symmetric hero** (3e4afd2): lateral chevrons, centered content, `FavoriteButton` top-right.
- **Hero radial halo** (c8dc3a5): symmetric radial background behind the sprite.
- **Prev/next navigation** (96eeaef): in the hero via `useAdjacentPokemon` — index relative to the filtered list, with fallback to absolute dex id when the filtered list is empty.

Pending on `feature/detail-fullview` (now superseded by the tabs/shiny redesign):

- **B3 — keyboard + a11y**: keyboard activation for prev/next, aria-expanded/aria-label, visible focus rings.
- **Step 2 — vertical evolution line with branch support**: evolution chain rendered vertically, handling branching (e.g. Eevee) — currently horizontal.
- **Step 3 — fit-on-screen polish**: ensure the dashboard fits without excessive scroll on common viewports.
- **Step 4 — app-wide polish**: persist theme (`Toggle.jsx`), honor URL filter params on direct detail visits (currently `useAdjacentPokemon` ignores them), misc cleanup.

## Phase 2 — Expanded Overview

**Estado: completada** en la rama `feature/detail-expanded-overview`.

Commits:

- `8d1fcfd` — helpers puros de Overview y Type Matchups.
- `d4187c4` — caché y fetching de relaciones defensivas de tipo.
- `d161cc7` — orquestación en `PokemonDetail`.
- `339923d` — interfaz final del Expanded Overview.

### Contenido final del Overview

- English Pokédex Entry (flavor text en inglés).
- Category.
- Height (decímetros -> metros).
- Weight (hectogramos -> kilogramos).
- Base Catch Rate.
- Habitat.
- Egg Groups.
- Regular Abilities.
- Hidden Abilities.
- Defensive Type Matchups: 4× Weaknesses, 2× Weaknesses, ½× Resistances, ¼× Resistances, 0× Immunities.
- Los resultados neutrales (multiplicador 1×) permanecen internos y **no** se renderizan.

### Helpers puros

`src/utils/pokemonDetails.js`:

- Selección de flavor text en inglés (`language.name === 'en'`) y normalización de whitespace (form-feed, saltos de línea, espacios repetidos).
- Selección de Category en inglés con fallback `Unknown`.
- `humanizeIdentifier` (guiones -> espacios, capitalización por palabra).
- Formateo de Egg Groups (overrides mínimos, p. ej. `humanshape` -> `Human-Like`, `water1` -> `Water 1`).
- Separación de habilidades regulares/ocultas exclusivamente por `is_hidden`.
- Formateo de Base Catch Rate (`45 / 255 · 17.6%`); valores inválidos o fuera de rango -> unavailable.

`src/utils/typeMatchups.js`:

- Cálculo puro de multiplicadores defensivos.
- Usa los tipos canónicos de `src/constants/types.js` como universo atacante (18 tipos).
- Soporta Pokémon de un solo tipo y de doble tipo.
- Multiplica modificadores defensivos (`multipliers[type] *= ...`); **nunca** concatena listas de debilidades/resistencias.
- Rechaza input incompleto (`complete: false`, `matchups: null`) sin producir resultados parciales.
- Mantiene los resultados neutrales internamente (no se renderizan).
- Conserva el orden canónico de `TYPES`.

### Capa de datos de relaciones defensivas

- `src/slices/pokeState.js`: `typeRelationsCache` (claves normalizadas lowercase).
- `src/slices/thunks.js`: `fetchTypeRelations(typeName)` — cache-first, deduplicación de requests en vuelo (`inFlightTypeRelations`), normaliza la clave con `trim().toLowerCase()`, y no despacha acciones globales de error ni loading para Type Matchups.
- `src/utils/cache.js`: persistencia IndexedDB + saneo en hidratación; las entradas malformadas se descartan (`isValidDefensiveRelations` / `sanitizeTypeRelationsCache`).
- `src/main.jsx`: hidratación de `typeRelationsCache` antes del render.

Solo se almacena la forma defensiva mínima:

- `double_damage_from`
- `half_damage_from`
- `no_damage_from`

Las relaciones ofensivas **nunca** deben usarse para el cálculo defensivo:

- `double_damage_to`
- `half_damage_to`
- `no_damage_to`

### Regla de multiplicadores

`finalMultiplier = multiplierTypeA × multiplierTypeB`

Ejemplos: `2 × 2 = 4×`, `2 × 0.5 = 1×`, `0.5 × 0.5 = 0.25×`, `0 × 2 = 0×`.

Reglas:

- Nunca concatenar listas de debilidades o resistencias.
- Nunca mostrar resultados parciales cuando falta una relación defensiva requerida.
- Un recurso de tipo exitoso puede permanecer cacheado aunque otro tipo falle.

### Orquestación en `PokemonDetail`

- Deriva la identidad de ruta normalizada (`normalizedRouteName`).
- Acepta datos de Pokémon solo si `pokemon.name` coincide con la ruta actual (`isCurrentPokemon` gatea `defensiveTypeKey` y `overviewData`).
- Acepta Species local o cacheada solo si `species.name` coincide con la ruta actual (`effectiveSpecies`).
- Usa Species cacheada de la ruta actual si Evolution Chain falla tras haber cacheado Species.
- Carga Type Relations de forma independiente de Species y Evolution.
- Usa estados scoped locales: `idle`, `loading`, `success`, `error`.
- Usa un token de secuencia compartido (`typeMatchupsSequenceRef`) para: carga automática, Retry, navegación rápida, múltiples retries y unmount.
- Las ejecuciones obsoletas pueden poblar la caché de Redux pero no actualizan estado local obsoleto.
- Retry afecta solo a Type Matchups; no recarga Pokémon, Species, Evolution, Abilities ni Moves.

### UI

`src/components/PokemonDetailPanels.jsx`:

- Composición del Expanded Overview.
- Pokédex Entry full-width.
- Biological Data y Abilities como tarjetas desktop de ancho igual con alturas naturales independientes (`md:flex-row md:items-start`).
- Mobile en una sola columna.
- Usa las habilidades preparadas (Regular/Hidden) en vez de los datos crudos de abilities.

`src/components/TypeMatchups.jsx`:

- Presentacional únicamente: sin fetching, sin dispatch de Redux, sin IndexedDB, sin cálculo de multiplicadores.
- Maneja `idle`, `loading`, `success`, `error`, Retry, unavailable y grupos vacíos.
- No renderiza el grupo neutral.
- Muestra nombre de tipo (capitalizado) y multiplicador textual.
- Usa el orden canónico recibido del helper (no reordena).
- Grid responsive: 1 columna (mobile), 2 (small), 3 (large), 5 (extra-large).

Aislamiento:

- Un fallo de Type Matchups no bloquea hero, datos biológicos del Overview, Stats, Evolution & Forms, Moves, Normal/Shiny, navegación, tema ni footer.
- Un fallo de Evolution no elimina Species cacheada del Overview.
- Hidden Abilities, Habitat, Egg Groups, flavor text u otros campos ausentes usan fallbacks en inglés scoped y no se tratan como fallos de página.

### Archivos de la Fase 2

Creados:

- `src/components/TypeMatchups.jsx`
- `src/utils/pokemonDetails.js`
- `src/utils/typeMatchups.js`

Modificados:

- `src/components/PokemonDetailPanels.jsx`
- `src/main.jsx`
- `src/pages/PokemonDetail.jsx`
- `src/slices/pokeState.js`
- `src/slices/thunks.js`
- `src/utils/cache.js`

### Fuera de alcance

La Fase 2 **no** implementó:

- advanced/max stats;
- Mega o formas especiales;
- move fetching;
- sprites animados;
- descripciones de abilities;
- cobertura ofensiva;
- calculadora de EV/IV/Nature;
- traducción global al inglés;
- TypeScript;
- dependencias nuevas.

## Remaining ideas (deferred)

- Prefetch-on-hover for instant modal open.
- Reuse `PokemonCardSkeleton` during fetch in detail.
- Stats radar chart, type-effectiveness table.
- List virtualization (`react-window`).
- Retry/error boundary refinements (ErrorBoundary exists since 3459f08).
- **Known observation (non-Phase-2)**: Previous/Next navigation may preserve scroll position; under some scroll positions the sticky header can temporarily overlap the BackButton. This behavior predates Phase 2 and was not changed in Expanded Overview. Defer it to a future navigation or UI-quality task.

## Definition of done (per phase)

- Build clean (`pnpm build`) + linter OK (`pnpm linter`), no React warnings.
- Tested in dev server; relevant state persists after reload where applicable.
- Committed on its own branch with a clear Spanish message. Never `--no-verify`.
