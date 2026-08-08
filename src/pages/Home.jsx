import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import {
  ContentPage,
  ErrorBoundary,
  FilterBar,
  PokemonModal,
  Spinner,
  PokemonCardSkeleton
} from '../components'
import {
  setSearchTerm,
  setActiveTypes,
  setGeneration,
  setSortBy,
  setFavOnly
} from '../slices/pokeState'
import { useFilteredList } from '../Hooks/useFilteredList'

const SCROLL_KEY = 'pokeduxHomeScroll'

const SORTS = ['id', 'name', 'stat']

const EmptyResults = ({ favoritesOnly, hasFavorites }) => (
  <div className='flex flex-col items-center gap-2 py-16 text-center text-gray-500 dark:text-gray-400'>
    <p className='text-3xl font-bold text-gray-400 dark:text-gray-600'>
      {favoritesOnly && !hasFavorites ? 'Aún no tienes favoritos' : 'Sin resultados'}
    </p>
    <p>
      {favoritesOnly && !hasFavorites
        ? 'Toca el corazón de un pokémon para guardarlo aquí.'
        : 'Prueba con otros filtros o términos de búsqueda.'}
    </p>
  </div>
)

export const Home = () => {
  const dispatch = useDispatch()
  const openPokemonId = useSelector((state) => state.pokeState.openPokemonId)
  const favOnly = useSelector((state) => state.pokeState.favOnly)
  const hasFavorites = useSelector((state) => state.pokeState.favorites.length > 0)
  const [searchParams] = useSearchParams()

  // URL que alimenta el pipeline: nutriendo Redux para que useFilteredList lo lea
  useEffect(() => {
    dispatch(setSearchTerm(searchParams.get('search') || ''))
    dispatch(setActiveTypes((searchParams.get('type') || '').split(',').filter(Boolean)))
    dispatch(setGeneration(searchParams.get('gen') || null))
    const sort = searchParams.get('sort') || 'id'
    dispatch(setSortBy(SORTS.includes(sort) ? sort : 'id'))
    dispatch(setFavOnly(searchParams.get('fav') === '1'))
  }, [searchParams, dispatch])

  const { workingList, filtersLoading, namesLoading } = useFilteredList()

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

  return (
    <>
      <FilterBar total={workingList.length} />

      {namesLoading && <Spinner />}

      {!namesLoading &&
        (filtersLoading
          ? (
            <div className='mx-auto flex max-w-[1700px] flex-wrap items-center justify-center gap-5 overflow-hidden py-5 transition-colors duration-500 dark:bg-gray-900'>
              {[...new Array(20)].map((_, i) => (
                <PokemonCardSkeleton key={i} />
              ))}
            </div>
            )
          : workingList.length > 0
            ? (
              <ContentPage workingList={workingList} />
              )
            : (
              <EmptyResults favoritesOnly={favOnly} hasFavorites={hasFavorites} />
              ))}

      <ErrorBoundary>
        <AnimatePresence>{openPokemonId && <PokemonModal />}</AnimatePresence>
      </ErrorBoundary>
    </>
  )
}
