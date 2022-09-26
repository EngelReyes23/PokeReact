import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  count: 0,
  prevPage: null,
  nextPage: null,
  pokemonData: null,
  pokemonDataList: []
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
    }
  }
})

export const { setPokemonData, setPokemonList, setPokeDataState } = pokeState.actions
