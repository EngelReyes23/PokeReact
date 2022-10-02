import { ContentPage, Footer, Header, PokemonList, Spinner } from '../components'
import { useData } from '../Hooks/useData'

export const Home = () => {
  const { isLoading, pokemonDataList } = useData()

  return (
    <main className='min-h-screen bg-gray-100 transition-colors duration-500 dark:bg-gray-900'>
      <Header />

      {isLoading && <Spinner />}

      <ContentPage>
        <PokemonList pokemonDataList={pokemonDataList} />
      </ContentPage>

      <Footer />
    </main>
  )
}
