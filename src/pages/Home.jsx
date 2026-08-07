import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { ContentPage, ErrorBoundary, PokemonList, PokemonModal, Spinner } from '../components'
import { useData } from '../Hooks/useData'

const SCROLL_KEY = 'pokeduxHomeScroll'

const EmptyResults = ({ query }) => (
  <div className='flex flex-col items-center gap-2 py-16 text-center text-gray-500 dark:text-gray-400'>
    <p className='text-3xl font-bold text-gray-400 dark:text-gray-600'>Sin resultados</p>
    <p>
      No se encontró ningún pokémon para <span className='font-medium'>&quot;{query}&quot;</span>.
    </p>
  </div>
)

export const Home = () => {
  const { isLoading, pokemonDataList } = useData()
  const openPokemonId = useSelector((state) => state.pokeState.openPokemonId)
  const searchTerm = useSelector((state) => state.pokeState.searchTerm)
  const allPokemonNames = useSelector((state) => state.pokeState.allPokemonNames)

  useEffect(() => {
    const saved = window.sessionStorage.getItem(SCROLL_KEY)
    if (saved) {
      window.scrollTo(0, Number(saved))
      window.sessionStorage.removeItem(SCROLL_KEY)
    }
    return () => {
      window.sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
    }
  }, [])

  const searching = searchTerm !== ''
  const searchResults = searching
    ? allPokemonNames
      .filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 20)
    : []

  return (
    <>
      {!searching && (
        <>
          {isLoading && <Spinner />}
          <ContentPage>
            <PokemonList pokemonDataList={pokemonDataList} />
          </ContentPage>
        </>
      )}

      {searching &&
        (allPokemonNames.length === 0
          ? (
            <Spinner />
            )
          : searchResults.length > 0
            ? (
              <PokemonList pokemonDataList={searchResults} />
              )
            : (
              <EmptyResults query={searchTerm} />
              ))}

      <ErrorBoundary>
        <AnimatePresence>{openPokemonId && <PokemonModal />}</AnimatePresence>
      </ErrorBoundary>
    </>
  )
}
