import { configureStore } from '@reduxjs/toolkit'
import { pokeState, UI } from '../slices'

export const store = configureStore({
  reducer: {
    pokeState: pokeState.reducer,
    UI: UI.reducer
  }
})
