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
import { setSearchTerm, setActiveTypes, setGeneration, setSortBy } from '../slices/pokeState'
import { useFilteredList } from '../Hooks/useFilteredList'

const SCROLL_KEY = 'pokeduxHomeScroll'

const SORTS = ['id', 'name', 'stat']

const EmptyResults = () => (
  <div className='flex flex-col items-center gap-2 py-16 text-center text-gray-500 dark:text-gray-400'>
    <p className='text-3xl font-bold text-gray-400 dark:text-gray-600'>Sin resultados</p>
    <p>Prueba con otros filtros o términos de búsqueda.</p>
  </div>
)

export const Home = () => {
  const dispatch = useDispatch()
  const openPokemonId = useSelector((state) => state.pokeState.openPokemonId)
  const [searchParams] = useSearchParams()

  // URL que alimenta el pipeline: nutriendo Redux para que useFilteredList lo lea
  useEffect(() => {
    dispatch(setSearchTerm(searchParams.get('search') || ''))
    dispatch(setActiveTypes((searchParams.get('type') || '').split(',').filter(Boolean)))
    dispatch(setGeneration(searchParams.get('gen') || null))
    const sort = searchParams.get('sort') || 'id'
    dispatch(setSortBy(SORTS.includes(sort) ? sort : 'id'))
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
              <EmptyResults />
              ))}

      <ErrorBoundary>
        <AnimatePresence>{openPokemonId && <PokemonModal />}</AnimatePresence>
      </ErrorBoundary>
    </>
  )
}
