import { AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { ContentPage, PokemonList, PokemonModal, Spinner } from '../components'
import { useData } from '../Hooks/useData'

export const Home = () => {
  const { isLoading, pokemonDataList } = useData()
  const activePokemon = useSelector((state) => state.pokeState.activePokemon)

  return (
    <>
      {isLoading && <Spinner />}

      <ContentPage>
        <PokemonList pokemonDataList={pokemonDataList} />
      </ContentPage>

      <AnimatePresence>{activePokemon && <PokemonModal />}</AnimatePresence>
    </>
  )
}
