import { useDispatch, useSelector } from 'react-redux'
import { Dark, Light } from '../icons'
import { toggleDarkMode } from '../slices/UI'

export const Toggle = () => {
  const { UI } = useSelector((state) => state)
  const dispatch = useDispatch()

  return (
    <button
      className='rounded-full p-2 text-yellow-400 transition-colors duration-700 hover:bg-gray-200 active:ring dark:text-white'
      onClick={() => dispatch(toggleDarkMode())}
    >
      {UI.isDarkMode ? <Dark className='h-8 w-8' /> : <Light className='h-8 w-8' />}
    </button>
  )
}
