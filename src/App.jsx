import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
    <>
      <h1 className='sticky top-0 z-10 mb-5 select-none bg-white/95 py-3 text-center text-4xl font-bold text-purple-600'>
        Pokedux
      </h1>

      {UI.isLoading ? <Spinner /> : <PokemonList pokemonList={pokeState.pokemonList} />}
    </>
  )
}

export default App
