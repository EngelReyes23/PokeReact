import { useEffect, useLayoutEffect, useRef } from 'react'
import { useAnimate, usePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Badge } from './Badge'
import { Card } from './Card'
import { FavoriteButton } from './FavoriteButton'
import { setOpenPokemonId, setActivePokemon, setPokemonSourceRect } from '../slices/pokeState'
import { TYPES } from '../constants/types'

const imageNotFound =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'

const STAT_LABELS = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'Spe'
}

const FLY_TRANSITION = { type: 'spring', stiffness: 300, damping: 30 }
const FADE_TRANSITION = { duration: 0.2, ease: 'easeOut' }

const imageFrom = (sprites) =>
  sprites?.other?.['official-artwork']?.front_default ||
  sprites?.other?.home?.front_default ||
  sprites?.front_shiny ||
  sprites?.front_default ||
  imageNotFound

const StatSkeleton = () => (
  <div className='w-full animate-pulse space-y-2'>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} className='flex items-center gap-2'>
        <div className='h-3 w-8 rounded bg-gray-300 dark:bg-gray-600' />
        <div className='h-2 flex-1 rounded-full bg-gray-300 dark:bg-gray-600' />
        <div className='h-3 w-6 rounded bg-gray-300 dark:bg-gray-600' />
      </div>
    ))}
  </div>
)

// #region Component
export const PokemonModal = () => {
  const dispatch = useDispatch()
  const { search } = useLocation()
  const pokemon = useSelector((state) => state.pokeState.activePokemon)
  const sourceRect = useSelector((state) => state.pokeState.pokemonSourceRect)
  const [isPresent, safeToRemove] = usePresence()
  const [scope, animate] = useAnimate()
  const overlayRef = useRef(null)

  // Devuelve el transform (x/y/scale) que lleva el centro del modal hasta una caja dada
  const flyToBox = (fromRect, rect) => {
    const dx = fromRect.left + fromRect.width / 2 - (rect.left + rect.width / 2)
    const dy = fromRect.top + fromRect.height / 2 - (rect.top + rect.height / 2)
    return {
      x: dx,
      y: dy,
      scaleX: fromRect.width / rect.width,
      scaleY: fromRect.height / rect.height
    }
  }

  // Al montar: arranca desde el rect de la card y vuela al centro
  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (sourceRect) {
      const from = { ...flyToBox(sourceRect, rect), opacity: 1 }
      animate(el, from, { duration: 0 })
      window.requestAnimationFrame(() => {
        animate(el, { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 }, FLY_TRANSITION)
      })
    } else {
      animate(el, { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 }, FLY_TRANSITION)
    }

    if (overlayRef.current) {
      animate(overlayRef.current, { opacity: 1 }, FADE_TRANSITION)
    }
  }, [])

  // Al salir (openPokemonId -> null): vuela de vuelta a la fuente y luego desmonta
  useEffect(() => {
    if (isPresent) return
    const el = scope.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const target = sourceRect ? flyToBox(sourceRect, rect) : { x: 0, y: 0, scaleX: 1, scaleY: 1 }
    if (overlayRef.current) animate(overlayRef.current, { opacity: 0 }, FADE_TRANSITION)
    animate(el, { ...target, opacity: 0 }, FLY_TRANSITION).then(() => {
      safeToRemove()
      dispatch(setActivePokemon(null))
      dispatch(setPokemonSourceRect(null))
    })
  }, [isPresent])

  const close = () => {
    // Solo limpia openPokemonId: el exit vuela la card y AnimatePresence la desmonta
    dispatch(setOpenPokemonId(null))
  }

  // Bloquear el scroll del body mientras el modal está abierto
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  // Cerrar con la tecla Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  if (!pokemon) return null

  const { name, types, sprites } = pokemon
  const pokemonTypes = types?.map((type) => type.type.name) || []
  const typeColor = TYPES[pokemonTypes[0]]?.color || TYPES.bug.color

  return (
    <>
      <div
        ref={overlayRef}
        className='fixed inset-0 z-50 bg-black/70'
        style={{ opacity: 0 }}
        onClick={close}
      />
      <Card
        ref={scope}
        style={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-label={`Detalles de ${name}`}
        className='fixed inset-0 z-50 m-auto h-fit max-h-[90vh] w-full max-w-md overflow-y-auto p-6 shadow-lg'
      >
        <button
          type='button'
          onClick={close}
          aria-label='Cerrar'
          className='absolute right-4 top-4 z-10 rounded-lg px-2 py-1 text-gray-500 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
        >
          X
        </button>

        <div className='flex flex-col items-center gap-3 text-gray-900 dark:text-gray-100'>
          <span
            className='rounded-full'
            style={{
              backgroundColor: `${typeColor}50`
            }}
          >
            <img src={imageFrom(sprites)} alt={name} className='h-44 w-44 object-cover' />
          </span>

          <div className='flex items-center justify-center gap-3'>
            <h2 className='text-h2 capitalize text-gray-900 dark:text-gray-100'>{name}</h2>
            <FavoriteButton name={name} />
          </div>

          <div className='flex items-center justify-center gap-2'>
            {pokemonTypes.map((type) => (
              <Badge key={type} type={type} {...TYPES[type]} />
            ))}
          </div>

          <div className='grid w-full grid-cols-2 gap-x-4 gap-y-1 text-sm'>
            <span className='text-label capitalize text-muted'>Altura</span>
            <span className='text-right font-semibold'>
              {pokemon.height != null ? `${pokemon.height / 10} m` : '—'}
            </span>
            <span className='text-label capitalize text-muted'>Peso</span>
            <span className='text-right font-semibold'>
              {pokemon.weight != null ? `${pokemon.weight / 10} kg` : '—'}
            </span>
          </div>

          <div className='w-full'>
            <p className='mb-2 text-caption uppercase tracking-wide text-muted'>Stats</p>
            {pokemon.stats?.length
              ? (
                <div className='space-y-1'>
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name} className='flex items-center gap-2 text-sm'>
                      <span className='w-8 shrink-0 font-semibold'>
                        {STAT_LABELS[stat.stat.name]}
                      </span>
                      <div className='h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600'>
                        <div
                          className='h-full rounded-full bg-brand-500'
                          style={{ width: `${Math.min(100, stat.base_stat)}%` }}
                        />
                      </div>
                      <span className='w-6 shrink-0 text-right font-semibold'>{stat.base_stat}</span>
                    </div>
                  ))}
                </div>
                )
              : (
                <StatSkeleton />
                )}
          </div>

          <div className='w-full'>
            <p className='mb-1 text-caption uppercase tracking-wide text-muted'>Habilidades</p>
            {pokemon.abilities?.length
              ? (
                <ul className='space-y-0.5 text-sm'>
                  {pokemon.abilities.map(({ ability, is_hidden: isHidden }) => (
                    <li key={ability.name} className='capitalize'>
                      <span className='font-semibold'>{ability.name}</span>
                      {isHidden && (
                        <span className='ml-2 rounded bg-gray-300 px-1.5 py-0.5 text-[10px] uppercase dark:bg-gray-700'>
                          oculta
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                )
              : (
                <div className='animate-pulse space-y-2'>
                  <div className='h-3 w-32 rounded bg-gray-300 dark:bg-gray-600' />
                  <div className='h-3 w-24 rounded bg-gray-300 dark:bg-gray-600' />
                </div>
                )}
          </div>

          <Link
            to={`/pokemon/${name}${search}`}
            onClick={(e) => {
              e.stopPropagation()
              close()
            }}
            className='mt-2 inline-block font-semibold text-brand-600 underline-offset-2 hover:underline dark:text-brand-300'
          >
            Ver más detalles →
          </Link>
        </div>
      </Card>
    </>
  )
}
// #endregion Component
