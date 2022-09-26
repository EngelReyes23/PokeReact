import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Local imports
import { fetchPokemonDataList } from '../slices/thunks'
import { PaginationComponent } from './PaginationComponent'

const scroll = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}

export const ContentPage = ({ children }) => {
  const [page, setPage] = useState(() => {
    const localPage = window.localStorage.getItem('page')

    return localPage ? parseInt(localPage) : 0
  })

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

  const props = {
    page,
    nextPage,
    prevPage,
    handlePageChange,
    totalPages: Math.ceil(count / 20)
  }

  return (
    <>
      <PaginationComponent {...props} />
      {children}
      <PaginationComponent {...props} />
    </>
  )
}
