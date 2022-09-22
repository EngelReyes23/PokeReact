import { PokemonCard } from './PokemonCard'

export const PokemonList = ({ pokemonList }) => (
  <div className='mx-auto flex flex-wrap items-center justify-center gap-5'>
    {pokemonList.map((pokemon) => (
      <PokemonCard key={pokemon.id} pokemon={pokemon} />
    ))}
  </div>
)
