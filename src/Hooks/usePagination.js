import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

// Local imports
import { fetchPokemonDataList } from '../slices/thunks'

const scroll = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}

const readPageFromUrl = (searchParams) => {
  const parsed = parseInt(searchParams.get('page'), 10)
  return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed
}

export const usePagination = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(() => readPageFromUrl(searchParams))

  const nextPage = useSelector((state) => state.pokeState.nextPage)
  const prevPage = useSelector((state) => state.pokeState.prevPage)
  const count = useSelector((state) => state.pokeState.count)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPokemonDataList(page))
  }, [page, dispatch])

  const handlePageChange = (page) => {
    scroll()
    setPage(page)
    if (page > 0) {
      setSearchParams({ page: String(page) })
    } else {
      setSearchParams({})
    }
  }

  return {
    page,
    nextPage,
    prevPage,
    handlePageChange,
    totalPages: Math.ceil(count / 20)
  }
}
