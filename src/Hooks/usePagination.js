import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Local imports
import { fetchPokemonDataList } from '../slices/thunks'

const scroll = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}

const localPage = parseInt(window.localStorage.getItem('page')) || 0

export const usePagination = () => {
  const [page, setPage] = useState(localPage)

  const {
    pokeState: { nextPage, prevPage, count }
  } = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPokemonDataList(page))
  }, [page])

  const handlePageChange = (page) => {
    scroll()
    setPage(page)
    window.localStorage.setItem('page', page)
  }

  return {
    page,
    nextPage,
    prevPage,
    handlePageChange,
    totalPages: Math.ceil(count / 20)
  }
}
