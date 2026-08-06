# AGENTS.md

## Developer Commands

- `npm run dev` - Starts the development server
- `npm run build` - Builds the production application
- `npm run preview` - Preview the built application
- `npm run fmt` - Formats all files with Prettier
- `npm run linter` - Runs Standard ESLint with fixes

## Project Structure

- Main entry: `src/main.jsx` → `src/App.jsx`
- Components: `src/components/`
  - `PokemonCard.jsx`, `PokemonList.jsx`, etc.
- Pages: `src/pages/Home.jsx`
- State management: Redux Toolkit in `src/slices/`
- API: `src/utils/api.js`
- Icons: `src/icons/` with index.js
- Build: Vite configured in `vite.config.js`
- CSS: Tailwind CSS with PostCSS processing

## Tooling Notes

- JavaScript modules (`.mjs` format) with Standard ESLint
- Prettier formatting for JS/TS/JSON/CSS/MD files
- Tailwind CSS with PostCSS processing
- React plugin via `@vitejs/plugin-react`
- Husky pre-commit hooks installed via `npm run prepare`

## Testing

No test framework or test files present in the repository. Testing is not currently configured.