import { AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { ContentPage, ErrorBoundary, PokemonList, PokemonModal, Spinner } from '../components'
import { useData } from '../Hooks/useData'

export const Home = () => {
  const { isLoading, pokemonDataList } = useData()
  const openPokemonId = useSelector((state) => state.pokeState.openPokemonId)

  return (
    <>
      {isLoading && <Spinner />}

      <ContentPage>
        <PokemonList pokemonDataList={pokemonDataList} />
      </ContentPage>

      <ErrorBoundary>
        <AnimatePresence>{openPokemonId && <PokemonModal />}</AnimatePresence>
      </ErrorBoundary>
    </>
  )
}
