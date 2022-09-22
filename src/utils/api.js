const API_URL = 'https://pokeapi.co/api/v2/'

// consigue la lista de los pokemons de la api y todos sus detalles de cada pokemon
export const getPokemonList = async (offset = '0') => {
  const res = await fetch(`${API_URL}pokemon?offset=${offset}`)
  const data = await res.json()
  const pokemonList = data.results
  const pokemonData = await Promise.all(
    pokemonList.map(async (pokemon) => {
      const res = await fetch(pokemon.url)
      const data = await res.json()
      return data
    })
  )
  return pokemonData
}

// consigue los detalles de un pokemon en especifico
export const getPokemon = async (pokemonName) => {
  const res = await fetch(`${API_URL}pokemon/${pokemonName}`)
  const data = await res.json()
  return data
}

// consigue los detalles de un pokemon en especifico y sus evoluciones
export const getPokemonWithEvolutions = async (pokemonName) => {
  const res = await fetch(`${API_URL}evolution-chain/${pokemonName}`)
  const data = await res.json()
  return data
}
