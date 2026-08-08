import { useDispatch, useSelector, useStore } from 'react-redux'
import { toggleFavorite } from '../slices/pokeState'
import { saveFavorites } from '../utils/cache'

// Heart icon: filled when favorited, outline otherwise.
export const HeartIcon = ({ filled }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='pointer-events-none h-5 w-5'
    viewBox='0 0 24 24'
    fill={filled ? 'currentColor' : 'none'}
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
  </svg>
)

// Toggles a Pokemon's favorite state. stopPropagation on click/keydown so it
// never opens the card modal; persists the list on every change.
export const FavoriteButton = ({ name, className = '' }) => {
  const dispatch = useDispatch()
  const store = useStore()

  const isFavorite = useSelector((state) => state.pokeState.favorites.includes(name))

  const toggle = (e) => {
    e.stopPropagation()
    dispatch(toggleFavorite(name))
    const updated = store.getState().pokeState.favorites
    saveFavorites(updated)
  }

  return (
    <button
      type='button'
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Quitar ${name} de favoritos` : `Añadir ${name} a favoritos`}
      onClick={toggle}
      onKeyDown={(e) => e.stopPropagation()}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
        isFavorite
          ? 'text-brand-500'
          : 'text-gray-400 hover:text-brand-300 dark:text-gray-500 dark:hover:text-brand-300'
      } ${className}`}
    >
      <HeartIcon filled={isFavorite} />
    </button>
  )
}
