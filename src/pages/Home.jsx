import { ContentPage, PokemonList, Spinner } from '../components'
import { useData } from '../Hooks/useData'

export const Home = () => {
  const { isLoading, pokemonDataList } = useData()

  return (
    <>
      {isLoading && <Spinner />}

      <ContentPage>
        <PokemonList pokemonDataList={pokemonDataList} />
      </ContentPage>
    </>
  )
}
