import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  count: 0,
  prevPage: null,
  nextPage: null,
  pokemonData: null,
  pokemonDataList: [],
  expandedPokemonId: null,
  pokemonCache: {}
}

export const pokeState = createSlice({
  name: 'pokeState',
  initialState,
  reducers: {
    setPokemonData: (state, action) => {
      state.pokemonData = action.payload
    },
    setPokeDataState: (state, action) => {
      state.count = action.payload.count
      state.nextPage = action.payload.next
      state.prevPage = action.payload.previous
      state.pokemonDataList = action.payload.results
    },
    setExpandedPokemonId: (state, action) => {
      state.expandedPokemonId = action.payload
    },
    setPokemonCache: (state, action) => {
      const { name, key, data } = action.payload
      state.pokemonCache[name] = state.pokemonCache[name] || {}
      state.pokemonCache[name][key] = data
    },
    hydrateCache: (state, action) => {
      state.pokemonCache = action.payload
    }
  }
})

export const {
  setPokemonData,
  setPokemonList,
  setPokeDataState,
  setExpandedPokemonId,
  setPokemonCache,
  hydrateCache
} = pokeState.actions
