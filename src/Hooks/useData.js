import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPokemonDataList } from '../slices/thunks'

const localPage = window.localStorage.getItem('page') || 0

export const useData = () => {
  const {
    UI: { isLoading, error },
    pokeState: { pokemonDataList }
  } = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPokemonDataList(localPage))
  }, [])

  return {
    error,
    isLoading,
    pokemonDataList
  }
}
