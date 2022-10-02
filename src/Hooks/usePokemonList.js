import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// Local imports
import { getPokemonList } from '../helpers'
import { setLoading } from '../slices/UI'

export const usePokemonList = (pokemonDataList) => {
  const [pokemonList, setPokemonList] = useState([])
  const dispatch = useDispatch()

  const getPokemonData = () => {
    dispatch(setLoading(true))

    getPokemonList(pokemonDataList)
      .then(setPokemonList)
      .finally(
        setTimeout(() => {
          dispatch(setLoading(false))
        }, 1500)
      )
  }

  useEffect(() => {
    pokemonDataList.length > 0 && getPokemonData()
  }, [pokemonDataList])

  return { pokemonList }
}
