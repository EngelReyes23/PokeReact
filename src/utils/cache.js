import { get, set } from 'idb-keyval'

const CACHE_KEY = 'pokemonCache'
const NAMES_CACHE_KEY = 'allPokemonNames'
const TYPE_CACHE_KEY = 'typeCache'
const GENERATION_CACHE_KEY = 'generationCache'
const FAVORITES_KEY = 'favorites'
const TYPE_RELATIONS_CACHE_KEY = 'typeRelationsCache'

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

export const isValidDefensiveRelations = (entry) => {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return false
  return (
    Array.isArray(entry.double_damage_from) &&
    Array.isArray(entry.half_damage_from) &&
    Array.isArray(entry.no_damage_from)
  )
}

const sanitizeTypeRelationsCache = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {}

  const sanitized = {}
  for (const key of Object.keys(data)) {
    const normalizedKey = typeof key === 'string' ? key.trim().toLowerCase() : ''
    if (!normalizedKey) continue
    if (!isValidDefensiveRelations(data[key])) continue
    sanitized[normalizedKey] = data[key]
  }
  return sanitized
}

export const saveTypeRelationsCache = async (cache) => {
  try {
    await set(TYPE_RELATIONS_CACHE_KEY, cache)
  } catch (error) {
    console.warn('No se pudo persistir la caché de relaciones de tipo', error)
  }
}

export const loadTypeRelationsCache = async () => {
  try {
    const data = await get(TYPE_RELATIONS_CACHE_KEY)
    return sanitizeTypeRelationsCache(data)
  } catch (error) {
    console.warn('No se pudo cargar la caché de relaciones de tipo', error)
    return {}
  }
}
