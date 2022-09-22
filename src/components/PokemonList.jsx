import { PokemonCard } from './PokemonCard'

export const PokemonList = ({ pokemonList }) => (
  <div className='mx-auto flex flex-wrap items-center justify-center gap-5 transition-colors duration-700 dark:bg-gray-900'>
    {pokemonList.map((pokemon) => (
      <PokemonCard key={pokemon.id} pokemon={pokemon} />
    ))}
  </div>
)
