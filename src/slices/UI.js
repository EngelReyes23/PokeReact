import { createSlice } from '@reduxjs/toolkit'

const setDarkMode = (isDarkMode) => {
  window.localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
  isDarkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark')
}

// verifica si SO esta en modo oscuro
const isDarkModeSO = window.matchMedia('(prefers-color-scheme: dark)').matches

// verifica si en el localStorage hay un valor para el modo oscuro
const isDarkModeLocalStorage = JSON.parse(window.localStorage.getItem('darkMode'))

// respeta el modo oscuro del SO solo si no hay un valor en el localStorage
const isDarkMode = isDarkModeLocalStorage === null ? isDarkModeSO : isDarkModeLocalStorage
setDarkMode(isDarkMode)

const initialState = {
  isLoading: false,
  error: null,
  isDarkMode
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
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode
      setDarkMode(state.isDarkMode)
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

export const { setLoading, clearAll, clearError, setError, toggleDarkMode } = UI.actions
