// Adjacency is derived from Redux filter state, which is only populated by Home. On a direct
// URL visit with filter query params (Home never mounted), Redux holds default filters, so
// workingList is the full unfiltered dex and navigation follows absolute dex order, ignoring
// the URL's filter params. This is an accepted graceful fallback; honoring URL filters on
// direct visits is deferred to the Step 4 polish.

import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useFilteredList } from './useFilteredList'
import { MAX_POKEMON_ID } from '../constants/pokemon'

const idFromUrl = (url = '') => {
  const parts = String(url).split('/').filter(Boolean)
  return Number(parts[parts.length - 1]) || 0
}

const findNameById = (list, targetId) => {
  const entry = list.find(({ url }) => idFromUrl(url) === targetId)
  return entry?.name || null
}

export const useAdjacentPokemon = (currentName, currentId) => {
  const { search } = useLocation()
  const { workingList, filtersLoading, namesLoading } = useFilteredList()
  const allPokemonNames = useSelector((state) => state.pokeState.allPokemonNames)

  return useMemo(() => {
    if (filtersLoading || namesLoading) {
      return { prevName: null, nextName: null, hasPrev: false, hasNext: false, search }
    }

    if (workingList.length > 0) {
      const idx = workingList.findIndex((entry) => entry.name === currentName)
      if (idx !== -1) {
        const prevName = idx > 0 ? workingList[idx - 1].name : null
        const nextName = idx < workingList.length - 1 ? workingList[idx + 1].name : null
        return {
          prevName,
          nextName,
          hasPrev: idx > 0,
          hasNext: idx < workingList.length - 1,
          search
        }
      }
    }

    let prevName = null
    let hasPrev = false
    let nextName = null
    let hasNext = false

    if (currentId > 1) {
      prevName = findNameById(allPokemonNames, currentId - 1)
      hasPrev = prevName != null
    }

    if (currentId < MAX_POKEMON_ID) {
      nextName = findNameById(allPokemonNames, currentId + 1)
      hasNext = nextName != null
    }

    return { prevName, nextName, hasPrev, hasNext, search }
  }, [workingList, filtersLoading, namesLoading, currentName, currentId, search, allPokemonNames])
}
