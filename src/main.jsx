import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { store } from './store'
import {
  loadCache,
  loadNames,
  loadTypeCache,
  loadGenerationCache,
  loadFavorites,
  loadTypeRelationsCache
} from './utils/cache'
import {
  hydrateCache,
  setAllPokemonNames,
  hydrateTypeCache,
  hydrateGenerationCache,
  hydrateFavorites,
  hydrateTypeRelationsCache
} from './slices/pokeState'

const bootstrap = async () => {
  const cache = await loadCache()
  store.dispatch(hydrateCache(cache))

  const names = await loadNames()
  if (names.length) store.dispatch(setAllPokemonNames(names))

  const typeCache = await loadTypeCache()
  if (Object.keys(typeCache).length) store.dispatch(hydrateTypeCache(typeCache))

  const generationCache = await loadGenerationCache()
  if (Object.keys(generationCache).length) store.dispatch(hydrateGenerationCache(generationCache))

  const favorites = await loadFavorites()
  if (favorites.length) store.dispatch(hydrateFavorites(favorites))

  const typeRelationsCache = await loadTypeRelationsCache()
  if (Object.keys(typeRelationsCache).length) {
    store.dispatch(hydrateTypeRelationsCache(typeRelationsCache))
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  )
}

bootstrap()
