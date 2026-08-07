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
  // TODO: dead code tras Fase 6, limpiar al final
  pageCache: {},
  searchTerm: '',
  allPokemonNames: [],
  activeTypes: [],
  generation: null,
  sortBy: 'id',
  typeCache: {},
  generationCache: {}
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
    },
    setPageCache: (state, action) => {
      const { page, data } = action.payload
      state.pageCache[page] = data
    },
    setActiveTypes: (state, action) => {
      state.activeTypes = action.payload
    },
    setGeneration: (state, action) => {
      state.generation = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setTypeCache: (state, action) => {
      const { type, data } = action.payload
      state.typeCache[type] = data
    },
    hydrateTypeCache: (state, action) => {
      state.typeCache = action.payload
    },
    setGenerationCache: (state, action) => {
      const { generation, data } = action.payload
      state.generationCache[generation] = data
    },
    hydrateGenerationCache: (state, action) => {
      state.generationCache = action.payload
    }
  }
})

export const {
  setPokemonData,
  setPokeDataState,
  setOpenPokemonId,
  setActivePokemon,
  setPokemonSourceRect,
  setPokemonCache,
  hydrateCache,
  setSearchTerm,
  setPageCache,
  setAllPokemonNames,
  setActiveTypes,
  setGeneration,
  setSortBy,
  setTypeCache,
  hydrateTypeCache,
  setGenerationCache,
  hydrateGenerationCache
} = pokeState.actions
