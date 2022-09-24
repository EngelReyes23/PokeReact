const API_URL = 'https://pokeapi.co/api/v2'

export const getPokemonDataList = async (url = `${API_URL}/pokemon?offset=0&limit=20`) => {
  const res = await fetch(url)
  return await res.json()
}

// consigue los detalles de un pokemon en especifico
export const getPokemonData = async (pokemonURL) => {
  const res = await fetch(pokemonURL)
  return await res.json()
}

// consigue los detalles de un pokemon en especifico y sus evoluciones
export const getPokemonWithEvolutions = async (pokemonName) => {
  const res = await fetch(`${API_URL}evolution-chain/${pokemonName}`)
  const data = await res.json()
  return data
}

export const getPokemonList = async (pokemonDataList) => {
  const promises = pokemonDataList.map(async (pokemon) => await getPokemonData(pokemon.url))
  return await Promise.all(promises)
}
