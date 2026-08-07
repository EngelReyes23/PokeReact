import { api } from '../utils/api'
import { setPokeDataState, setPokemonCache } from './pokeState'
import { setError, setLoading } from './UI'
import { saveCache } from '../utils/cache'

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

export const fetchPokemonDetail = (name, key = 'pokemon') => {
  return async (dispatch, getState) => {
    const cache = getState().pokeState.pokemonCache
    const cached = cache?.[name]?.[key]

    if (cached) return cached

    dispatch(setLoading(true))

    try {
      const data = await api.pokemon(name)
      dispatch(setPokemonCache({ name, key, data }))

      // Persistir sin bloquear el flujo inmediato
      const persistentCache = {
        ...cache,
        [name]: { ...(cache?.[name] || {}), [key]: data }
      }
      setTimeout(() => saveCache(persistentCache), PERSIST_AFTER_MS)

      return data
    } catch (error) {
      dispatch(setError(error.message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
}
