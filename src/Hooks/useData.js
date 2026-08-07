import { useSelector } from 'react-redux'

export const useData = () => {
  const isLoading = useSelector((state) => state.UI.isLoading)
  const error = useSelector((state) => state.UI.error)
  const pokemonDataList = useSelector((state) => state.pokeState.pokemonDataList)

  return {
    error,
    isLoading,
    pokemonDataList
  }
}
