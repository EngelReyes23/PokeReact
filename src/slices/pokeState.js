import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  count: 0,
  prevPage: null,
  nextPage: null,
  pokemonData: null,
  pokemonDataList: [],
  openPokemonId: null,
  activePokemon: null,
  pokemonSourceRect: null,
  pokemonCache: {},
  searchTerm: '',
  allPokemonNames: []
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
    setOpenPokemonId: (state, action) => {
      state.openPokemonId = action.payload
    },
    setActivePokemon: (state, action) => {
      state.activePokemon = action.payload
    },
    setPokemonSourceRect: (state, action) => {
      state.pokemonSourceRect = action.payload
    },
    setPokemonCache: (state, action) => {
      const { name, key, data } = action.payload
      state.pokemonCache[name] = state.pokemonCache[name] || {}
      state.pokemonCache[name][key] = data
    },
    hydrateCache: (state, action) => {
      state.pokemonCache = action.payload
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setAllPokemonNames: (state, action) => {
      state.allPokemonNames = action.payload
    }
  }
})

export const {
  setPokemonData,
  setPokemonList,
  setPokeDataState,
  setOpenPokemonId,
  setActivePokemon,
  setPokemonSourceRect,
  setPokemonCache,
  hydrateCache,
  setSearchTerm,
  setAllPokemonNames
} = pokeState.actions
