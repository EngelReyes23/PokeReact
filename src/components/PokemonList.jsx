import { usePokemonList } from '../Hooks/usePokemonList'
import { PokemonCard } from './PokemonCard'
import { PokemonCardSkeleton } from './PokemonCardSkeleton'

export const PokemonList = ({ pokemonDataList }) => {
  const { pokemonList } = usePokemonList(pokemonDataList)

  // En la primera carga de la página, muestra un skeleton
  if (pokemonList.length === 0) {
    return (
      <div className='mx-auto flex max-w-[1700px] flex-wrap items-center justify-center gap-5 overflow-hidden py-5 transition-colors duration-500 dark:bg-gray-900'>
        {[...new Array(20)].map((_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className='mx-auto flex max-w-[1700px] flex-wrap items-center justify-center gap-5 overflow-hidden py-5 transition-colors duration-500 dark:bg-gray-900'>
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  )
}
