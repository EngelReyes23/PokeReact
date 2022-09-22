import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Local imports
import { PokemonList } from './components/PokemonList'
import { Spinner } from './components/Spinner'
import { Toggle } from './components/Toggle'
import { fetchPokemonList } from './slices/thunks'

function App () {
  const { pokeState, UI } = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPokemonList())
  }, [])

  if (UI.error) return <div>Something went wrong {UI.error}</div>

  return (
    <div className='w-full transition-colors duration-700 dark:bg-gray-900'>
      <header className='sticky top-0 z-10 mb-3 w-full bg-gray-400/95 transition-colors duration-700 dark:bg-gray-700/95'>
        <div className='flex items-center justify-between p-4'>
          <h1 className='text-2xl font-bold text-purple-600 dark:text-purple-400'>Pokedux</h1>
          <Toggle />
        </div>
      </header>

      {UI.isLoading ? <Spinner /> : <PokemonList pokemonList={pokeState.pokemonList} />}
    </div>
  )
}

export default App
