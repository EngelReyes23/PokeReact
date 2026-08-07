import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPokemonDataList } from '../slices/thunks'

const localPage = window.localStorage.getItem('page') || 0

export const useData = () => {
  const isLoading = useSelector((state) => state.UI.isLoading)
  const error = useSelector((state) => state.UI.error)
  const pokemonDataList = useSelector((state) => state.pokeState.pokemonDataList)
  const searchTerm = useSelector((state) => state.pokeState.searchTerm)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!searchTerm) dispatch(fetchPokemonDataList(localPage))
  }, [searchTerm, dispatch])

  return {
    error,
    isLoading,
    pokemonDataList
  }
}
