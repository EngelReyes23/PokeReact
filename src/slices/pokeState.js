import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  pokemonDataList: [],
  pokemon: null,
  nextPage: null,
  prevPage: null
}

export const pokeState = createSlice({
  name: 'pokeState',
  initialState,
  reducers: {
    setPokemonList: (state, action) => {
      state.pokemonList = action.payload
    },
    setPokemon: (state, action) => {
      state.pokemon = action.payload
    },
    setPokeDataState: (state, action) => {
      return { ...state, ...action.payload }
    }
  }
})

export const { setPokemon, setPokemonList, setPokeDataState } = pokeState.actions
