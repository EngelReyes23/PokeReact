import { useDispatch, useSelector } from 'react-redux'
import { IconDark } from '../icons'
import { IconLight } from '../icons/IconLight'
import { toggleDarkMode } from '../slices/UI'

export const Toggle = () => {
  const {
    UI: { isDarkMode }
  } = useSelector((state) => state)
  const dispatch = useDispatch()

  return (
    <button
      onClick={() => dispatch(toggleDarkMode())}
      type='button'
      className='group relative rounded-lg p-2.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700'
    >
      {!isDarkMode ? <IconDark className='h-6 w-6' /> : <IconLight className='h-6 w-6' />}
      <span className='sr-only'>Toggle dark mode</span>

      {/* tooltip  */}
      <span className='absolute z-10 mx-auto hidden w-20 -translate-x-24 -translate-y-6 rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-500 shadow-lg transition-colors group-hover:block dark:bg-gray-700 dark:text-gray-400'>
        {!isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </span>
    </button>
  )
}
