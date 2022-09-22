import { getPokemonList } from '../utils/api'
import { setPokemonList } from './pokeState'
import { setError, setLoading } from './UI'

export const fetchPokemonList = () => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const pokemonList = await getPokemonList()
    dispatch(setPokemonList(pokemonList))
  } catch (error) {
    console.log('🚀 ~ fetchPokemonList ~ error', error)
    dispatch(setError(error.message))
  } finally {
    dispatch(setLoading(false))
  }
}
