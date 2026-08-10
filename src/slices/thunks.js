import { api } from '../utils/api'
import {
  setPokeDataState,
  setPokemonCache,
  setPageCache,
  setAllPokemonNames,
  setTypeCache,
  setGenerationCache,
  setTypeRelationsCache
} from './pokeState'
import { setError, setLoading } from './UI'
import {
  saveCache,
  saveNames,
  saveTypeCache,
  saveGenerationCache,
  saveTypeRelationsCache,
  isValidDefensiveRelations
} from '../utils/cache'
import { flattenChain, extractChainId } from '../utils/evolution'

// TODO: dead code tras Fase 6, limpiar al final
export const fetchPokemonDataList = (page = 0) => {
  return async (dispatch, getState) => {
    const cached = getState().pokeState.pageCache[page]
    if (cached) {
      dispatch(setPokeDataState(cached))
      return
    }

    dispatch(setLoading(true))

    try {
      const offset = page * 20
      const data = await api.pokemon('', { offset })

      dispatch(setPokeDataState(data))
      dispatch(setPageCache({ page, data }))
    } catch (error) {
      dispatch(setError(error.message))
    } finally {
      dispatch(setLoading(false))
    }
  }
}

const PERSIST_AFTER_MS = 500

const inFlightTypeRelations = new Map()

const extractDefensiveRelations = (data) => {
  const relations = data?.damage_relations || {}
  return {
    double_damage_from: Array.isArray(relations.double_damage_from)
      ? relations.double_damage_from
      : [],
    half_damage_from: Array.isArray(relations.half_damage_from) ? relations.half_damage_from : [],
    no_damage_from: Array.isArray(relations.no_damage_from) ? relations.no_damage_from : []
  }
}

const persistCache = (dispatch, cache, name, key, data) => {
  dispatch(setPokemonCache({ name, key, data }))

  const persistentCache = {
    ...cache,
    [name]: { ...(cache?.[name] || {}), [key]: data }
  }
  setTimeout(() => saveCache(persistentCache), PERSIST_AFTER_MS)
}

export const fetchPokemonDetail = (name, key = 'pokemon') => {
  return async (dispatch, getState) => {
    const cache = getState().pokeState.pokemonCache
    const cached = cache?.[name]?.[key]

    if (cached) return cached

    dispatch(setLoading(true))

    try {
      const data = await api.pokemon(name)
      persistCache(dispatch, cache, name, key, data)
      return data
    } catch (error) {
      dispatch(setError(error.message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
}

// PokeAPI no soporta búsqueda parcial por nombre: trae la lista completa una vez
// y se filtra en el cliente. La lista se persiste y se comprueba antes de pedirla.
export const fetchAllPokemonNames = () => {
  return async (dispatch, getState) => {
    const existing = getState().pokeState.allPokemonNames
    if (existing.length) return existing

    try {
      const data = await api.pokemon('', { limit: 100000 })
      const names = data.results
      dispatch(setAllPokemonNames(names))
      setTimeout(() => saveNames(names), PERSIST_AFTER_MS)
      return names
    } catch (error) {
      dispatch(setError(error.message))
      throw error
    }
  }
}

// Members of a given type (/type/{type} -> pokemon array). Cache-first in Redux and
// persisted in IndexedDB; each entry stores the raw pokemon list [{name, url}, ...].
export const fetchTypeList = (type) => {
  return async (dispatch, getState) => {
    const existing = getState().pokeState.typeCache[type]
    if (existing) return existing

    try {
      const data = await api.type(type)
      const members = data.pokemon.map(({ pokemon }) => pokemon)
      dispatch(setTypeCache({ type, data: members }))

      const refresh = () => saveTypeCache(getState().pokeState.typeCache)
      setTimeout(refresh, PERSIST_AFTER_MS)
      return members
    } catch (error) {
      dispatch(setError(error.message))
      throw error
    }
  }
}

// Members of a generation (/generation/{id} -> pokemon_species array).
export const fetchGenerationList = (generation) => {
  return async (dispatch, getState) => {
    const existing = getState().pokeState.generationCache[generation]
    if (existing) return existing

    try {
      const data = await api.generation(generation)
      const members = data.pokemon_species
      dispatch(setGenerationCache({ generation, data: members }))

      const refresh = () => saveGenerationCache(getState().pokeState.generationCache)
      setTimeout(refresh, PERSIST_AFTER_MS)
      return members
    } catch (error) {
      dispatch(setError(error.message))
      throw error
    }
  }
}

// Cadea /pokemon/{name} -> /pokemon-species/{name} (flavor/es + evolution_chain.url)
// -> /evolution-chain/{id} y la aplana en una lista ordenada con condiciones.
export const fetchEvolutionChain = (name) => {
  return async (dispatch, getState) => {
    const cache = getState().pokeState.pokemonCache
    const cachedSpecies = cache?.[name]?.species
    const cachedChain = cache?.[name]?.evolutionChain

    let species = cachedSpecies
    if (!species) {
      dispatch(setLoading(true))
      try {
        species = await api['pokemon-species'](name)
        persistCache(dispatch, cache, name, 'species', species)
      } catch (error) {
        dispatch(setError(error.message))
        throw error
      } finally {
        dispatch(setLoading(false))
      }
    }

    let chainDetail = cachedChain
    if (!chainDetail && species.evolution_chain?.url) {
      const chainId = extractChainId(species.evolution_chain.url)
      dispatch(setLoading(true))
      try {
        chainDetail = await api['evolution-chain'](chainId)
        persistCache(dispatch, cache, name, 'evolutionChain', chainDetail)
      } catch (error) {
        dispatch(setError(error.message))
        throw error
      } finally {
        dispatch(setLoading(false))
      }
    }

    return {
      species,
      chainDetail,
      evolution: flattenChain(chainDetail?.chain, getState().pokeState.pokemonCache)
    }
  }
}

// Defensive damage relations for a single type (/type/{name} -> damage_relations).
// Cache-first in Redux and IndexedDB; concurrent callers share one in-flight promise.
export const fetchTypeRelations = (typeName) => {
  return async (dispatch, getState) => {
    const normalizedType = typeof typeName === 'string' ? typeName.trim().toLowerCase() : ''
    if (!normalizedType) {
      throw new Error('Invalid type name')
    }

    const cached = getState().pokeState.typeRelationsCache[normalizedType]
    if (cached && isValidDefensiveRelations(cached)) return cached

    const inFlight = inFlightTypeRelations.get(normalizedType)
    if (inFlight) return inFlight

    const request = (async () => {
      try {
        const data = await api.type(normalizedType)
        const relations = extractDefensiveRelations(data)
        dispatch(setTypeRelationsCache({ type: normalizedType, data: relations }))

        const refresh = () => saveTypeRelationsCache(getState().pokeState.typeRelationsCache)
        setTimeout(refresh, PERSIST_AFTER_MS)
        return relations
      } finally {
        inFlightTypeRelations.delete(normalizedType)
      }
    })()

    inFlightTypeRelations.set(normalizedType, request)
    return request
  }
}
