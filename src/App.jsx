import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Local imports
import { Header } from './components/Header'
import { Pagination } from './components/Pagination'
import { PokemonList } from './components/PokemonList'
import { Spinner } from './components/Spinner'
import { fetchPokemonDataList } from './slices/thunks'
import { setLoading } from './slices/UI'
import { getPokemonData } from './utils/api'

function App () {
  const { pokeState, UI } = useSelector((state) => state)
  const dispatch = useDispatch()
  const [pokemonList, setPokemonList] = useState([])

  useEffect(() => {
    dispatch(fetchPokemonDataList())
  }, [])

  useEffect(() => {
    if (pokeState.pokemonDataList.length > 0) {
      setPokemonList([])
      dispatch(setLoading(true))
      const pokemonData = pokeState.pokemonDataList.map(async (pokemon) => {
        const pokemonRecord = await getPokemonData(pokemon.url)
        return pokemonRecord
      })
      Promise.all(pokemonData).then((results) => {
        setPokemonList(results)
        dispatch(setLoading(false))
      })
    }
  }, [pokeState.pokemonDataList])

  if (UI.error) return <div>Something went wrong {UI.error}</div>

  return (
    <div className='min-h-screen w-full bg-gray-100 transition-colors duration-700 dark:bg-gray-900'>
      <Header />
      {UI.isLoading && <Spinner />}
      <div className='mx-3 mb-5 flex justify-end'>
        <Pagination />
      </div>

      {!UI.isLoading && <PokemonList pokemonList={pokemonList} />}

      <div className='mt-5 flex justify-center pb-1 transition-colors duration-700'>
        <Pagination />
      </div>
    </div>
  )
}

export default App
