import { api } from '../utils/api'
import { setPokeDataState, setPokemonCache, setAllPokemonNames } from './pokeState'
import { setError, setLoading } from './UI'
import { saveCache, saveNames } from '../utils/cache'
import { flattenChain, extractChainId } from '../utils/evolution'

export const fetchPokemonDataList = (page = 0) => {
  return async (dispatch) => {
    dispatch(setLoading(true))

    try {
      const offset = page * 20
      const data = await api.pokemon('', { offset })

      dispatch(setPokeDataState(data))
    } catch (error) {
      dispatch(setError(error.message))
    } finally {
      dispatch(setLoading(false))
    }
  }
}

const PERSIST_AFTER_MS = 500

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
// y se filtra en cliente. La lista se persiste y se comprueba antes de pedirla.
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
