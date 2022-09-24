import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Footer } from './components/Footer'

// Local imports
import { Header } from './components/Header'
import { Pagination } from './components/Pagination'
import { PokemonList } from './components/PokemonList'
import { Spinner } from './components/Spinner'
import { fetchPokemonDataList } from './slices/thunks'

function App () {
  const {
    UI,
    pokeState: { pokemonDataList }
  } = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPokemonDataList())
  }, [])

  if (UI.error) return <div>Something went wrong {UI.error}</div>

  return (
    <div className='min-h-screen overflow-hidden bg-gray-100 transition-colors duration-700 dark:bg-gray-900'>
      {UI.isLoading && <Spinner />}

      <Header />

      <div className='container mx-auto flex items-center justify-center bg-gray-100/95 pt-5 transition-colors duration-700 dark:bg-gray-900 md:justify-end'>
        <Pagination />
      </div>

      <PokemonList pokemonDataList={pokemonDataList} />
      <div className='container mx-auto flex items-center justify-center bg-gray-100/95 py-3 pb-4 transition-colors duration-700 dark:bg-gray-900'>
        <Pagination />
      </div>
      <Footer />
    </div>
  )
}

export default App
