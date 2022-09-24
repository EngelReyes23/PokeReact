import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// Local imports
import { setLoading } from '../slices/UI'
import { getPokemonList } from '../utils/api'
import { PokemonCard } from './PokemonCard'

export const PokemonList = ({ pokemonDataList }) => {
  const [pokemonList, setPokemonList] = useState([])
  const dispatch = useDispatch()

  const fetchPokemonList = async () => {
    dispatch(setLoading(true))

    getPokemonList(pokemonDataList)
      .then(setPokemonList)
      .finally(() => dispatch(setLoading(false)))
  }

  useEffect(() => {
    pokemonDataList.length > 0 && fetchPokemonList()
  }, [pokemonDataList])

  return (
    <div className='mx-auto flex max-w-[1700px] flex-wrap items-center justify-center gap-5 overflow-hidden py-5 transition-colors duration-700 dark:bg-gray-900'>
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  )
}
