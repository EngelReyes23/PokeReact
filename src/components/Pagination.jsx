import { useDispatch, useSelector } from 'react-redux'

// Local imports
import { NextArrow, PrevArrow } from '../icons/'
import { fetchPokemonDataList } from '../slices/thunks'

export const Pagination = () => {
  const {
    pokeState: { nextPage, prevPage }
  } = useSelector((state) => state)

  const dispatch = useDispatch()

  const handleNext = () => {
    dispatch(fetchPokemonDataList(nextPage))
  }

  const handlePrev = () => {
    dispatch(fetchPokemonDataList(prevPage))
  }

  const handleReset = () => {
    dispatch(fetchPokemonDataList())
  }

  return (
    <>
      {prevPage && (
        <button
          onClick={handlePrev}
          className='mr-3 inline-flex items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 transition-colors duration-700 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
        >
          <PrevArrow />
          Previous
        </button>
      )}
      {/* eslint-disable-next-line multiline-ternary */}
      {nextPage ? (
        <button
          onClick={handleNext}
          className='inline-flex items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 transition-colors duration-700 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
        >
          Next
          <NextArrow />
        </button>
      ) : (
        <button
          onClick={handleReset}
          className='inline-flex items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 transition-colors duration-700 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
        >
          Next
          <NextArrow />
        </button>
      )}
    </>
  )
}
