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
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearAll: (state) => {
      state.isLoading = false
      state.error = null
    }
  }
})

export const { setLoading, clearAll, clearError, setError } = UI.actions
