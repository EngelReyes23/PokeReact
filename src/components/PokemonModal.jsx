import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Badge } from './Badge'
import { IconType } from './IconType'
import { setOpenPokemonId, setActivePokemon } from '../slices/pokeState'

const imageNotFound =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'

const typesColors = {
  bug: { color: '#94BC4A', icon: <IconType letter='b' /> },
  ice: { color: '#70CBD4', icon: <IconType letter='i' /> },
  dark: { color: '#736C75', icon: <IconType letter='d' /> },
  fire: { color: '#EA7A3C', icon: <IconType letter='r' /> },
  rock: { color: '#B2A061', icon: <IconType letter='k' /> },
  water: { color: '#539AE2', icon: <IconType letter='w' /> },
  fairy: { color: '#E397D1', icon: <IconType letter='y' /> },
  ghost: { color: '#846AB6', icon: <IconType letter='h' /> },
  grass: { color: '#71C558', icon: <IconType letter='g' /> },
  steel: { color: '#89A1B0', icon: <IconType letter='m' /> },
  dragon: { color: '#6A7BAF', icon: <IconType letter='n' /> },
  flying: { color: '#7DA6DE', icon: <IconType letter='v' /> },
  ground: { color: '#CC9F4F', icon: <IconType letter='a' /> },
  normal: { color: '#AAB09F', icon: <IconType letter='c' /> },
  poison: { color: '#B468B7', icon: <IconType letter='o' /> },
  psychic: { color: '#E5709B', icon: <IconType letter='p' /> },
  fighting: { color: '#CB5F48', icon: <IconType letter='f' /> },
  electric: { color: '#E5C531', icon: <IconType letter='l' /> }
}

const STAT_LABELS = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'Spe'
}

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
  const pokemon = useSelector((state) => state.pokeState.activePokemon)
  const [snapshot, setSnapshot] = useState(null)

  // Congela el pokémon mientras el modal hace el exit, aunque ya se haya cerrado
  useEffect(() => {
    if (pokemon) setSnapshot(pokemon)
  }, [pokemon])

  const data = pokemon || snapshot
  if (!data) return null

  const { id, name, types, sprites } = data
  const pokemonTypes = types?.map((type) => type.type.name) || []
  const typeColor = typesColors[pokemonTypes[0]]?.color || '#94BC4A'
  const close = () => {
    dispatch(setActivePokemon(null))
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
      if (e.key === 'Escape') {
        dispatch(setActivePokemon(null))
        dispatch(setOpenPokemonId(null))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [dispatch])

  return (
    <motion.div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={close}
    >
      <motion.div
        layoutId={`pokemon-${id}`}
        style={{ color: typeColor }}
        onClick={(e) => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-label={`Detalles de ${name}`}
        className='relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800'
      >
        <button
          type='button'
          onClick={close}
          aria-label='Cerrar'
          className='absolute right-4 top-4 z-10 rounded-lg px-2 py-1 text-gray-500 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
        >
          X
        </button>

        <div className='flex flex-col items-center gap-3'>
          <span
            className='rounded-full'
            style={{
              backgroundColor: `${typeColor}50`
            }}
          >
            <img src={imageFrom(sprites)} alt={name} className='h-44 w-44 object-cover' />
          </span>

          <h2 className='text-3xl font-bold capitalize'>{name}</h2>

          <div className='flex items-center justify-center gap-2'>
            {pokemonTypes.map((type) => (
              <Badge
                key={type}
                type={type}
                icon={typesColors[type].icon}
                color={typesColors[type].color}
              />
            ))}
          </div>

          <div className='grid w-full grid-cols-2 gap-x-4 gap-y-1 text-sm'>
            <span className='capitalize'>Altura</span>
            <span className='text-right font-semibold'>
              {data.height != null ? `${data.height / 10} m` : '—'}
            </span>
            <span className='capitalize'>Peso</span>
            <span className='text-right font-semibold'>
              {data.weight != null ? `${data.weight / 10} kg` : '—'}
            </span>
          </div>

          <div className='w-full'>
            <p className='mb-2 text-left text-xs font-semibold uppercase opacity-70'>Stats</p>
            {data.stats?.length
              ? (
                <div className='space-y-1'>
                  {data.stats.map((stat) => (
                    <div key={stat.stat.name} className='flex items-center gap-2 text-sm'>
                      <span className='w-8 shrink-0 font-semibold'>
                        {STAT_LABELS[stat.stat.name]}
                      </span>
                      <div className='h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600'>
                        <div
                          className='h-full rounded-full bg-purple-500'
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
            <p className='mb-1 text-xs font-semibold uppercase opacity-70'>Habilidades</p>
            {data.abilities?.length
              ? (
                <ul className='space-y-0.5 text-sm'>
                  {data.abilities.map(({ ability, is_hidden: isHidden }) => (
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
            to={`/pokemon/${name}`}
            onClick={(e) => e.stopPropagation()}
            className='mt-2 inline-block font-semibold text-purple-600 underline-offset-2 hover:underline dark:text-purple-400'
          >
            Ver más detalles →
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
// #endregion Component
