import { get, set } from 'idb-keyval'

const CACHE_KEY = 'pokemonCache'
const NAMES_CACHE_KEY = 'allPokemonNames'

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
