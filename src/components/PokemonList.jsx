import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// Local imports
import { getPokemonList } from '../helpers'
import { setLoading } from '../slices/UI'
import { PokemonCard } from './PokemonCard'
import { PokemonCardSkeleton } from './PokemonCardSkeleton'

export const PokemonList = ({ pokemonDataList }) => {
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

  // En la primera carga de la página, muestra un skeleton
  if (pokemonList.length === 0) {
    return (
      <div className='mx-auto flex max-w-[1700px] flex-wrap items-center justify-center gap-5 overflow-hidden py-5 transition-colors duration-700 dark:bg-gray-900'>
        {[...new Array(20)].map((_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className='mx-auto flex max-w-[1700px] flex-wrap items-center justify-center gap-5 overflow-hidden py-5 transition-colors duration-700 dark:bg-gray-900'>
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  )
}
