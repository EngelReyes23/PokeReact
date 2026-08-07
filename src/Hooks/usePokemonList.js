import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// Local imports
import { api } from '../utils/api'
import { store } from '../store'
import { setPokemonCache } from '../slices/pokeState'

export const usePokemonList = (pokemonDataList) => {
  const [pokemonList, setPokemonList] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (!pokemonDataList?.length) {
      setPokemonList([])
      return undefined
    }

    let active = true
    const controller = new AbortController()

    const getPokemonData = async () => {
      const cache = store.getState().pokeState.pokemonCache

      const fetches = pokemonDataList.map(async ({ name }) => {
        const cached = cache?.[name]?.pokemon
        if (cached) return cached

        const data = await api.pokemon(name, '', { signal: controller.signal })
        dispatch(setPokemonCache({ name, key: 'pokemon', data }))
        return data
      })

      try {
        const list = await Promise.all(fetches)
        if (active) setPokemonList(list)
      } catch (error) {
        if (error.name !== 'AbortError' && active) {
          console.error('Failed to load the Pokémon list', error)
        }
      }
    }

    getPokemonData()

    return () => {
      active = false
      controller.abort()
    }
  }, [pokemonDataList, dispatch])

  return { pokemonList }
}
