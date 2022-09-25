import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Local imports
import { Footer, Header, Pagination, PokemonList, Spinner } from './components/'
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
    <div className='min-h-screen bg-gray-100 transition-colors duration-700 dark:bg-gray-900'>
      <Header />
      {UI.isLoading && <Spinner />}

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
