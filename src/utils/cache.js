import { get, set } from 'idb-keyval'

const CACHE_KEY = 'pokemonCache'

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
