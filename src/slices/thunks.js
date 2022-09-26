import { api } from '../utils/api'
import { setPokeDataState } from './pokeState'
import { setError, setLoading } from './UI'

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
