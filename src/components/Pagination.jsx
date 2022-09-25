import { useDispatch, useSelector } from 'react-redux'

// Local imports
import { IconNextArrow, IconPrevArrow } from '../icons/'
import { fetchPokemonDataList } from '../slices/thunks'

const scroll = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}

export const Pagination = () => {
  const {
    pokeState: { nextPage, prevPage }
  } = useSelector((state) => state)

  const dispatch = useDispatch()

  const handleNext = () => {
    scroll()
    dispatch(fetchPokemonDataList(nextPage))
  }

  const handlePrev = () => {
    scroll()
    dispatch(fetchPokemonDataList(prevPage))
  }

  const handleReset = () => {
    scroll()
    dispatch(fetchPokemonDataList())
  }

  return (
    <>
      {prevPage && (
        <button
          onClick={handlePrev}
          className='mr-3 inline-flex select-none items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
        >
          <IconPrevArrow />
          Previous
        </button>
      )}
      {/* eslint-disable-next-line multiline-ternary */}
      {nextPage ? (
        <button
          onClick={handleNext}
          className='inline-flex select-none items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
        >
          Next
          <IconNextArrow />
        </button>
      ) : (
        <button
          onClick={handleReset}
          className='inline-flex select-none items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
        >
          Next
          <IconNextArrow />
        </button>
      )}
    </>
  )
}
