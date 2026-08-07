import { useSearchParams } from 'react-router-dom'

const PAGE_SIZE = 20

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

// Paginación 100% client-side sobre el subconjunto ya filtrado (workingList).
// La página vive en ?page=N y se clampea a la última válida si el filtro la deja fuera.
export const usePagination = (workingList = []) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const totalPages = Math.max(1, Math.ceil(workingList.length / PAGE_SIZE))
  const page = Math.min(readPageFromUrl(searchParams), totalPages - 1)

  const start = page * PAGE_SIZE
  const pageItems = workingList.slice(start, start + PAGE_SIZE)

  const handlePageChange = (page) => {
    scroll()
    const next = new URLSearchParams(searchParams)
    if (page > 0) next.set('page', String(page))
    else next.delete('page')
    setSearchParams(next, { replace: false })
  }

  return {
    page,
    pageItems,
    totalPages,
    total: workingList.length,
    handlePageChange,
    prevPage: page > 0,
    nextPage: page < totalPages - 1
  }
}
