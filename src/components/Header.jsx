import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Toggle } from './Toggle'
import { setSearchTerm } from '../slices/pokeState'
import { fetchAllPokemonNames } from '../slices/thunks'

const SearchIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='pointer-events-none absolute left-2.5 h-5 w-5 text-gray-400'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z'
    />
  </svg>
)

const CloseIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-4 w-4'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
  </svg>
)

const SearchField = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const searchTerm = useSelector((state) => state.pokeState.searchTerm)
  const [value, setValue] = useState(searchTerm)

  useEffect(() => {
    if (searchTerm !== value.trim()) setValue(searchTerm)
  }, [searchTerm])

  useEffect(() => {
    const timer = setTimeout(() => {
      const term = value.trim()
      if (term === searchTerm) return
      dispatch(fetchAllPokemonNames())
      dispatch(setSearchTerm(term))
      if (term && pathname !== '/') navigate('/')
    }, 300)
    return () => clearTimeout(timer)
  }, [value, searchTerm, pathname, dispatch, navigate])

  const clear = () => {
    setValue('')
    dispatch(setSearchTerm(''))
  }

  return (
    <div className='relative flex items-center'>
      <SearchIcon />
      <input
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Buscar pokémon...'
        aria-label='Buscar pokémon'
        className='w-44 rounded-lg border border-transparent bg-gray-200/70 py-1.5 pl-8 pr-8 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-purple-500 focus:bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-gray-700 sm:w-56'
      />
      {value !== '' && (
        <button
          type='button'
          onClick={clear}
          aria-label='Limpiar búsqueda'
          className='absolute right-2 rounded-full p-0.5 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200'
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}

export const Header = () => (
  <header className='sticky top-0 z-20 w-full select-none bg-gray-200/95 px-3 py-3 transition-colors duration-500 dark:bg-gray-800/95 sm:px-4'>
    <div className='container mx-auto flex h-full items-center justify-between gap-4'>
      <h1 className='text-4xl font-bold text-purple-600'>Pokedux</h1>
      <div className='flex items-center gap-3'>
        <SearchField />
        <Toggle />
      </div>
    </div>
  </header>
)
