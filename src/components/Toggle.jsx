import { useDispatch, useSelector } from 'react-redux'
import { Dark, Light } from '../icons'
import { toggleDarkMode } from '../slices/UI'

export const Toggle = () => {
  const { UI } = useSelector((state) => state)
  const dispatch = useDispatch()

  return (
    <button
      onClick={() => dispatch(toggleDarkMode())}
      type='button'
      className='peer rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-800'
    >
      {!UI.isDarkMode ? <Dark className='h-6 w-6' /> : <Light className='h-6 w-6' />}
      <span className='sr-only'>Toggle dark mode</span>
    </button>
  )
}
