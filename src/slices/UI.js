import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  error: null
}

export const UI = createSlice({
  name: 'UI',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    }
  }
})

export const { setLoading } = UI.actions
