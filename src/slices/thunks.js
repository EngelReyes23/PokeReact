import { getPokemonDataList } from '../utils/api'
import { setPokeDataState } from './pokeState'
import { setError, setLoading } from './UI'

export const fetchPokemonDataList = (url) => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const data = await getPokemonDataList(url)

    const StateData = {
      nextPage: data.next,
      prevPage: data.previous,
      pokemonDataList: data.results
    }

    dispatch(setPokeDataState(StateData))
  } catch (error) {
    dispatch(setError(error.message))
  } finally {
    dispatch(setLoading(false))
  }
}
