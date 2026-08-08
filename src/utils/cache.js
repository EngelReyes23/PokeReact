import { get, set } from 'idb-keyval'

const CACHE_KEY = 'pokemonCache'
const NAMES_CACHE_KEY = 'allPokemonNames'
const TYPE_CACHE_KEY = 'typeCache'
const GENERATION_CACHE_KEY = 'generationCache'
const FAVORITES_KEY = 'favorites'

export const saveCache = async (cache) => {
  try {
    await set(CACHE_KEY, cache)
  } catch (error) {
    console.warn('No se pudo persistir la caché', error)
  }
}

export const loadCache = async () => {
  try {
    return (await get(CACHE_KEY)) || {}
  } catch (error) {
    console.warn('No se pudo cargar la caché', error)
    return {}
  }
}

export const saveNames = async (names) => {
  try {
    await set(NAMES_CACHE_KEY, names)
  } catch (error) {
    console.warn('No se pudo persistir la lista de nombres', error)
  }
}

export const loadNames = async () => {
  try {
    return (await get(NAMES_CACHE_KEY)) || []
  } catch (error) {
    console.warn('No se pudo cargar la lista de nombres', error)
    return []
  }
}

export const saveTypeCache = async (cache) => {
  try {
    await set(TYPE_CACHE_KEY, cache)
  } catch (error) {
    console.warn('No se pudo persistir la caché de tipos', error)
  }
}

export const loadTypeCache = async () => {
  try {
    return (await get(TYPE_CACHE_KEY)) || {}
  } catch (error) {
    console.warn('No se pudo cargar la caché de tipos', error)
    return {}
  }
}

export const saveGenerationCache = async (cache) => {
  try {
    await set(GENERATION_CACHE_KEY, cache)
  } catch (error) {
    console.warn('No se pudo persistir la caché de generaciones', error)
  }
}

export const loadGenerationCache = async () => {
  try {
    return (await get(GENERATION_CACHE_KEY)) || {}
  } catch (error) {
    console.warn('No se pudo cargar la caché de generaciones', error)
    return {}
  }
}

export const saveFavorites = async (favorites) => {
  try {
    await set(FAVORITES_KEY, favorites)
  } catch (error) {
    console.warn('No se pudieron persistir los favoritos', error)
  }
}

export const loadFavorites = async () => {
  try {
    return (await get(FAVORITES_KEY)) || []
  } catch (error) {
    console.warn('No se pudieron cargar los favoritos', error)
    return []
  }
}
