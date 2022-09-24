import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
      state.pokemonDat = action.payload
    },
    setPokeDataState: (state, action) => {
      return { ...state, ...action.payload }
    }
  }
})

export const { setPokemonData, setPokemonList, setPokeDataState } = pokeState.actions
