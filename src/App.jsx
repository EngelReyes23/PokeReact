import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Header } from './components/Header'
import { Pagination } from './components/Pagination'

// Local imports
import { PokemonList } from './components/PokemonList'
import { Spinner } from './components/Spinner'
import { fetchPokemonList } from './slices/thunks'

function App () {
  const { pokeState, UI } = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPokemonList())
  }, [])

  if (UI.error) return <div>Something went wrong {UI.error}</div>

  return (
    <div className='min-h-screen w-full transition-colors duration-700 dark:bg-gray-900'>
      <Header />
      {UI.isLoading && <Spinner />}
      <Pagination />
      <PokemonList pokemonList={pokeState.pokemonList} />
    </div>
  )
}

export default App
