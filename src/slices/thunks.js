import { api } from '../utils/api'
import { setPokeDataState } from './pokeState'
import { setError, setLoading } from './UI'

export const fetchPokemonDataList = (limit = 0) => {
  return async (dispatch) => {
    dispatch(setLoading(true))

    try {
      const data = await api.pokemon('', { limit })

      dispatch(setPokeDataState(data))
    } catch (error) {
      dispatch(setError(error.message))
    } finally {
      dispatch(setLoading(false))
    }
  }
}

export const fetchNextPage = (url) => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const data = await api.next(url)

    dispatch(setPokeDataState(data))
  } catch (error) {
    dispatch(setError(error.message))
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchPrevPage = (url) => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const data = await api.previous(url)

    dispatch(setPokeDataState(data))
  } catch (error) {
    dispatch(setError(error.message))
  } finally {
    dispatch(setLoading(false))
  }
}
