import { api } from '../utils/api'

export const getPokemonList = async (pokemonDataList) => {
  const promiseList = await pokemonDataList.map(async (pokemon) => await api.pokemon(pokemon.name))
  const pokemonList = await Promise.all(promiseList)
  return pokemonList
}
