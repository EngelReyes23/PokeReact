import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  pokemonList: [],
  pokemon: null
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
    }
  }
})

export const { setPokemon, setPokemonList } = pokeState.actions
