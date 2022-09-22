import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchPokemonList } from '../slices/thunks'

export const Pagination = () => {
  const [page, setPage] = useState(0)

  const dispatch = useDispatch()

  const offset = page * 20

  const handleNext = () => {
    setPage(page + 1)
  }

  const handlePrev = () => {
    setPage(page - 1)
  }

  useEffect(() => {
    dispatch(fetchPokemonList(offset))
  }, [offset])

  return (
    <div className='flex items-center justify-center'>
      <button
        className='rounded-full p-2 text-yellow-400 transition-colors duration-700 hover:bg-gray-200 active:ring dark:text-white'
        onClick={handlePrev}
      >
        Prev
      </button>
      <button
        className='rounded-full p-2 text-yellow-400 transition-colors duration-700 hover:bg-gray-200 active:ring dark:text-white'
        onClick={handleNext}
      >
        Next
      </button>

      <p className='text-2xl font-bold text-purple-600'>{page}</p>

      <button
        className='rounded-full p-2 text-yellow-400 transition-colors duration-700 hover:bg-gray-200 active:ring dark:text-white'
        onClick={() => setPage(0)}
      >
        Reset
      </button>

      <button
        className='rounded-full p-2 text-yellow-400 transition-colors duration-700 hover:bg-gray-200 active:ring dark:text-white'
        onClick={() => setPage(10)}
      >
        10
      </button>
    </div>
  )
}
