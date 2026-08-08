import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { Spinner } from '../components/Spinner'
import { StatBlock } from '../components/StatBlock'
import { fetchPokemonDetail, fetchEvolutionChain } from '../slices/thunks'
import { imageFrom } from '../utils/evolution'
import { TYPES } from '../constants/types'

const imageNotFound =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'

const getSpanishFlavor = (species) => {
  const entry = species?.flavor_text_entries?.find((e) => e.language?.name === 'es')
  return entry?.flavor_text?.replace(/[\f\n]/g, ' ').trim()
}

const padId = (id) => `#${String(id).padStart(3, '0')}`

const BackButton = ({ search }) => (
  <Link
    to={search ? `/${search}` : '/'}
    className='self-start rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-600 transition-colors hover:bg-brand-500 hover:text-white dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-brand-600'
  >
    ← Volver
  </Link>
)

const Abilities = ({ abilities }) => (
  <div>
    <h4 className='text-label text-muted'>Habilidades</h4>
    <ul className='mt-1.5 flex flex-wrap gap-1.5'>
      {abilities.map(({ ability, is_hidden: isHidden }) => (
        <li
          key={ability.name}
          className='rounded-full bg-brand-100 px-3 py-1 text-sm capitalize dark:bg-brand-700/40'
        >
          {ability.name}
          {isHidden && <span className='text-xs text-muted'> (oculta)</span>}
        </li>
      ))}
    </ul>
  </div>
)

export const PokemonDetail = () => {
  const dispatch = useDispatch()
  const { name } = useParams()
  const { search } = useLocation()
  const [pokemon, setPokemon] = useState(null)
  const [species, setSpecies] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      setIsLoading(true)
      setError(null)
      setPokemon(null)
      setSpecies(null)

      try {
        const p = await Promise.all([
          dispatch(fetchPokemonDetail(name)),
          dispatch(fetchEvolutionChain(name))
        ])
        if (!active) return
        setPokemon(p[0])
        setSpecies(p[1].species)
      } catch (err) {
        if (active) setError(err)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [dispatch, name])

  if (error) {
    return (
      <section className='container mx-auto flex flex-col items-center gap-4 px-4 py-10'>
        <BackButton search={search} />
        <p className='text-xl'>No pudimos cargar este pokémon.</p>
        <p className='text-sm text-gray-500'>{error.message}</p>
        <button
          type='button'
          onClick={() => window.location.reload()}
          className='rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-600'
        >
          Reintentar
        </button>
      </section>
    )
  }

  if (!pokemon || isLoading) {
    return (
      <section className='container mx-auto flex flex-col items-center gap-6 px-4 py-10'>
        <BackButton search={search} />
        <Spinner />
      </section>
    )
  }

  const { id, types, stats, abilities } = pokemon
  const image = imageFrom(pokemon.sprites) || imageNotFound
  const mainType = types[0]?.type?.name
  const typeColor = TYPES[mainType]?.color || TYPES.bug.color
  const flavorText = getSpanishFlavor(species)

  return (
    <section className='container mx-auto flex flex-col gap-4 px-4 py-6 text-gray-900 dark:text-gray-100'>
      <BackButton search={search} />

      <Card className='flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-center sm:gap-6'>
        <span className='shrink-0 rounded-full' style={{ backgroundColor: `${typeColor}50` }}>
          <img src={image} alt={name} className='h-36 w-36 object-cover sm:h-40 sm:w-40' />
        </span>

        <div className='flex w-full flex-col gap-3 text-center sm:text-left'>
          <div className='flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 sm:justify-between'>
            <h1 className='text-h1 capitalize text-gray-900 dark:text-gray-100'>{name}</h1>
            <span className='rounded-full bg-gray-100 px-2.5 py-0.5 font-mono text-caption text-gray-500 dark:bg-gray-700 dark:text-gray-300'>
              {padId(id)}
            </span>
          </div>

          <div className='flex flex-wrap justify-center gap-2 sm:justify-start'>
            {types.map((type) => {
              const t = type.type.name
              return <Badge key={t} type={t} {...TYPES[t]} />
            })}
          </div>
        </div>
      </Card>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.2fr_0.9fr] lg:gap-5'>
        <Card className='flex h-full flex-col gap-4 p-5'>
          <h3 className='text-caption uppercase tracking-wide text-muted'>Pokédex Entry</h3>
          {flavorText && (
            <p className='text-sm leading-relaxed text-gray-700 dark:text-gray-300'>
              “{flavorText}”
            </p>
          )}

          <div className='mt-auto grid grid-cols-2 gap-3'>
            <div>
              <p className='text-label text-muted'>Altura</p>
              <p className='text-xl font-bold'>{pokemon.height / 10} m</p>
            </div>
            <div>
              <p className='text-label text-muted'>Peso</p>
              <p className='text-xl font-bold'>{pokemon.weight / 10} kg</p>
            </div>
          </div>

          {abilities?.length > 0 && <Abilities abilities={abilities} />}
        </Card>

        <div className='h-full'>
          <StatBlock stats={stats} layout='grid' />
        </div>

        <div className='flex h-full flex-col lg:max-h-[calc(100vh-25rem)] lg:overflow-y-auto lg:pr-1'>
          <h3 className='mb-3 text-caption uppercase tracking-wide text-muted'>Línea evolutiva</h3>
          {/* Paso 2: cadena evolutiva vertical con soporte de ramas */}
          <p className='text-sm text-muted'>Skeleton del Paso 1 — cadena vertical en el Paso 2.</p>
        </div>
      </div>
    </section>
  )
}
