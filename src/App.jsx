import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Local imports
import { ContentPage, Footer, Header, PokemonList, Spinner } from './components/'
import { fetchPokemonDataList } from './slices/thunks'

function App () {
  const {
    UI,
    pokeState: { pokemonDataList }
  } = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    const page = window.localStorage.getItem('page') || 0

    dispatch(fetchPokemonDataList(page))
  }, [])

  if (UI.error) return <div>Something went wrong {UI.error}</div>

  return (
    <div className='min-h-screen bg-gray-100 transition-colors duration-500 dark:bg-gray-900'>
      <Header />
      {UI.isLoading && <Spinner />}

      <ContentPage>
        <PokemonList pokemonDataList={pokemonDataList} />
      </ContentPage>

      <Footer />
    </div>
  )
}

export default App
