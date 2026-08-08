import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { Badge } from './Badge'
import { FavoriteButton } from './FavoriteButton'
import {
  setOpenPokemonId,
  setActivePokemon,
  setPokemonSourceRect,
  setPokemonCache
} from '../slices/pokeState'
import { fetchPokemonDetail } from '../slices/thunks'
import { TYPES } from '../constants/types'

const imageNotFound =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'

const styles = (pokemonTypes, percentage) => {
  let background = ''

  if (pokemonTypes.length > 1) {
    background = `linear-gradient(0deg, ${pokemonTypes
      .map((type) => TYPES[type].color + percentage)
      .join(', ')})`
  } else background = TYPES[pokemonTypes[0]].color + percentage

  return {
    background,
    color: TYPES[pokemonTypes[0]].color
  }
}

const imageFrom = (sprites) =>
  sprites.other['official-artwork'].front_default ||
  sprites.other.home.front_default ||
  sprites.front_shiny ||
  sprites.front_default ||
  imageNotFound

// #region Component
export const PokemonCard = ({ pokemon }) => {
  const { id, name, types, sprites } = pokemon
  const pokemonTypes = types.map((type) => type.type.name)
  const dispatch = useDispatch()
  const cardRef = useRef(null)

  const openPokemonId = useSelector((state) => state.pokeState.openPokemonId)
  const cache = useSelector((state) => state.pokeState.pokemonCache)
  const cached = Boolean(cache?.[name]?.pokemon)

  const open = () => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (rect) {
      dispatch(
        setPokemonSourceRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        })
      )
    }
    dispatch(setActivePokemon(pokemon))
    dispatch(setOpenPokemonId(id))
    // La lista ya trae los datos completos: se siembra la caché para reutilizarla
    if (!cached) dispatch(setPokemonCache({ name, key: 'pokemon', data: pokemon }))
  }

  // Si el detalle no está cacheado, se busca al abrir el modal
  useEffect(() => {
    if (openPokemonId === id && !cached) {
      dispatch(fetchPokemonDetail(name))
    }
  }, [openPokemonId, cached, name, dispatch])

  return (
    <motion.div
      ref={cardRef}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
        }
      }}
      role='button'
      tabIndex={0}
      style={styles(pokemonTypes, 50)}
      className='animate__animated animate__fadeIn group relative flex max-h-full min-h-[250px] w-[250px] transform cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-xl border-current py-2.5 shadow-md transition-transform hover:scale-110 hover:border'
    >
      <FavoriteButton
        name={name}
        className='absolute right-2 top-2 z-10 bg-white/40 backdrop-blur-sm dark:bg-gray-900/40'
      />

      <div
        className='min-h-[150px] w-1/2 min-w-[150px] rounded-full border-current transition group-hover:border'
        style={styles(pokemonTypes, 50)}
      >
        <img
          alt={name}
          loading='lazy'
          decoding='async'
          className='w-full scale-110 object-cover'
          src={imageFrom(sprites)}
        />
      </div>

      <p className='-mt-1 text-center text-2xl font-semibold capitalize transition group-hover:font-bold'>
        {name}
      </p>

      <div className='flex items-center justify-center gap-2'>
        {pokemonTypes.map((type) => (
          <Badge key={type} type={type} {...TYPES[type]} />
        ))}
      </div>
    </motion.div>
  )
}
// #endregion Component
