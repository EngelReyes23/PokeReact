import { useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllPokemonNames, fetchTypeList, fetchGenerationList } from '../slices/thunks'

const idFromUrl = (url = '') => {
  const parts = String(url).split('/').filter(Boolean)
  return Number(parts[parts.length - 1]) || 0
}

const totalStatsOf = (pokemon) =>
  pokemon?.stats?.reduce((sum, stat) => sum + stat.base_stat, 0) ?? null

// Se prepara en Redux el estado de filtros (searchTerm, activeTypes, generation, sortBy)
// y aqui se hace el pipeline completo: filter -> sort -> listToDisplay sin paginar.
export const useFilteredList = () => {
  const dispatch = useDispatch()

  const allPokemonNames = useSelector((state) => state.pokeState.allPokemonNames)
  const searchTerm = useSelector((state) => state.pokeState.searchTerm)
  const activeTypes = useSelector((state) => state.pokeState.activeTypes)
  const generation = useSelector((state) => state.pokeState.generation)
  const sortBy = useSelector((state) => state.pokeState.sortBy)
  const typeCache = useSelector((state) => state.pokeState.typeCache)
  const generationCache = useSelector((state) => state.pokeState.generationCache)

  const pokemonCache = useSelector((state) => state.pokeState.pokemonCache)
  const cacheRef = useRef(pokemonCache)
  cacheRef.current = pokemonCache

  useEffect(() => {
    if (!allPokemonNames.length) dispatch(fetchAllPokemonNames())
  }, [allPokemonNames.length, dispatch])

  useEffect(() => {
    activeTypes.forEach((type) => {
      if (!typeCache[type]) dispatch(fetchTypeList(type))
    })
  }, [activeTypes, typeCache, dispatch])

  useEffect(() => {
    if (generation && !generationCache[generation]) {
      dispatch(fetchGenerationList(generation))
    }
  }, [generation, generationCache, dispatch])

  const filtersLoading =
    activeTypes.some((type) => !typeCache[type]) ||
    Boolean(generation && !generationCache[generation])

  const workingList = useMemo(() => {
    if (filtersLoading) return []

    const term = searchTerm.trim().toLowerCase()
    const list = Array.isArray(allPokemonNames) ? allPokemonNames : []

    let filtered = list

    if (term) {
      filtered = filtered.filter(({ name }) => name.toLowerCase().includes(term))
    }

    if (activeTypes.length) {
      const typeSets = activeTypes.map((type) => {
        const entries = typeCache[type] || []
        return new Set(entries.map(({ name }) => name))
      })
      filtered = filtered.filter(({ name }) => typeSets.every((set) => set.has(name)))
    }

    if (generation) {
      const genSet = new Set((generationCache[generation] || []).map(({ name }) => name))
      filtered = filtered.filter(({ name }) => genSet.has(name))
    }

    const sorted = [...filtered]

    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'stat') {
      const withStat = []
      const without = []
      sorted.forEach((entry) => {
        const pokemon = cacheRef.current?.[entry.name]?.pokemon
        const total = totalStatsOf(pokemon)
        if (total != null) {
          withStat.push({ entry, total })
        } else {
          without.push(entry)
        }
      })
      withStat.sort((a, b) => a.total - b.total)
      sorted.length = 0
      withStat.forEach(({ entry }) => sorted.push(entry))
      without.forEach((entry) => sorted.push(entry))
    } else {
      sorted.sort((a, b) => idFromUrl(a.url) - idFromUrl(b.url))
    }

    return sorted
  }, [
    allPokemonNames,
    searchTerm,
    activeTypes,
    typeCache,
    generation,
    generationCache,
    sortBy,
    filtersLoading
  ])

  return {
    workingList,
    filtersLoading,
    namesLoading: !allPokemonNames.length
  }
}
