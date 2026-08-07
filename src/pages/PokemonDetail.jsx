import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Badge } from '../components/Badge'
import { IconType } from '../components/IconType'
import { Spinner } from '../components/Spinner'
import { fetchPokemonDetail, fetchEvolutionChain } from '../slices/thunks'
import { imageFrom } from '../utils/evolution'

const imageNotFound =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'

const typesColors = {
  bug: { color: '#94BC4A' },
  ice: { color: '#70CBD4' },
  dark: { color: '#736C75' },
  fire: { color: '#EA7A3C' },
  rock: { color: '#B2A061' },
  water: { color: '#539AE2' },
  fairy: { color: '#E397D1' },
  ghost: { color: '#846AB6' },
  grass: { color: '#71C558' },
  steel: { color: '#89A1B0' },
  dragon: { color: '#6A7BAF' },
  flying: { color: '#7DA6DE' },
  ground: { color: '#CC9F4F' },
  normal: { color: '#AAB09F' },
  poison: { color: '#B468B7' },
  psychic: { color: '#E5709B' },
  fighting: { color: '#CB5F48' },
  electric: { color: '#E5C531' }
}

const STAT_LABELS = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'Spe'
}

const getSpanishFlavor = (species) => {
  const entry = species?.flavor_text_entries?.find((e) => e.language?.name === 'es')
  return entry?.flavor_text?.replace(/[\f\n]/g, ' ').trim()
}

const padId = (id) => `#${String(id).padStart(3, '0')}`

const BackButton = ({ page }) => (
  <Link
    to={page ? `/?page=${page}` : '/'}
    className='self-start rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-600 transition-colors hover:bg-purple-500 hover:text-white dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-purple-600'
  >
    ← Volver
  </Link>
)

const StatBars = ({ stats }) => (
  <section className='w-full'>
    <h3 className='mb-3 text-xl font-semibold'>Stats</h3>
    <div className='overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800'>
      {stats.map((stat) => (
        <div
          key={stat.stat.name}
          className='flex items-center justify-between gap-2 border-b px-4 py-2 text-sm last:border-0 dark:border-gray-700'
        >
          <span className='w-24 capitalize'>{STAT_LABELS[stat.stat.name] || stat.stat.name}</span>
          <div className='flex flex-1 items-center gap-2'>
            <div className='h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600'>
              <div
                className='h-full rounded-full bg-purple-500'
                style={{ width: `${Math.min(100, stat.base_stat)}%` }}
              />
            </div>
            <span className='w-10 text-right font-semibold'>{stat.base_stat}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
)

const Abilities = ({ abilities }) => (
  <section className='w-full'>
    <h3 className='mb-3 text-xl font-semibold'>Habilidades</h3>
    <ul className='flex flex-wrap gap-2'>
      {abilities.map(({ ability, is_hidden: isHidden }) => (
        <li
          key={ability.name}
          className='rounded-full bg-purple-100 px-4 py-1.5 capitalize dark:bg-purple-900'
        >
          {ability.name}
          {isHidden && ' (oculta)'}
        </li>
      ))}
    </ul>
  </section>
)

const EvolutionChain = ({ evolution, currentName }) => (
  <section className='w-full'>
    <h3 className='mb-3 text-xl font-semibold'>Línea evolutiva</h3>
    {evolution.length
      ? (
        <div className='flex flex-col items-center gap-2'>
          {evolution.map((evo, i) => (
            <div key={evo.id} className='flex flex-col items-center gap-2'>
              {i > 0 && (
                <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                  <span className='text-base leading-none'>↓</span>
                  <span className='italic'>{evo.condition || 'Desconocido'}</span>
                </div>
              )}
              <Link
                to={`/pokemon/${evo.name}`}
                className={`flex w-44 flex-col items-center gap-1 rounded-xl p-3 shadow-sm transition-transform hover:scale-105 ${
                evo.name === currentName
                  ? 'bg-purple-200 ring-2 ring-purple-400 dark:bg-purple-800'
                  : 'bg-white dark:bg-gray-800'
              }`}
              >
                <img src={evo.sprite} alt={evo.name} className='h-20 w-20 object-contain' />
                <span className='text-sm font-semibold capitalize'>{evo.name}</span>
              </Link>
            </div>
          ))}
        </div>
        )
      : (
        <p className='text-sm text-gray-500'>Sin cadena evolutiva.</p>
        )}
  </section>
)

export const PokemonDetail = () => {
  const dispatch = useDispatch()
  const { name } = useParams()
  const [searchParams] = useSearchParams()
  const returnPage = searchParams.get('page') || ''
  const [pokemon, setPokemon] = useState(null)
  const [species, setSpecies] = useState(null)
  const [evolution, setEvolution] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      setIsLoading(true)
      setError(null)
      setPokemon(null)
      setSpecies(null)
      setEvolution([])

      try {
        const p = await Promise.all([
          dispatch(fetchPokemonDetail(name)),
          dispatch(fetchEvolutionChain(name))
        ])
        if (!active) return
        setPokemon(p[0])
        setSpecies(p[1].species)
        setEvolution(p[1].evolution)
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
        <BackButton page={returnPage} />
        <p className='text-xl'>No pudimos cargar este pokémon.</p>
        <p className='text-sm text-gray-500'>{error.message}</p>
        <button
          type='button'
          onClick={() => window.location.reload()}
          className='rounded-lg bg-purple-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-purple-600'
        >
          Reintentar
        </button>
      </section>
    )
  }

  if (!pokemon || isLoading) {
    return (
      <section className='container mx-auto flex flex-col items-center gap-6 px-4 py-10'>
        <BackButton page={returnPage} />
        <Spinner />
      </section>
    )
  }

  const { id, types, stats, abilities } = pokemon
  const image = imageFrom(pokemon.sprites) || imageNotFound
  const mainType = types[0]?.type?.name
  const typeColor = typesColors[mainType]?.color || '#94BC4A'
  const flavorText = getSpanishFlavor(species)

  return (
    <section className='container mx-auto flex flex-col items-center gap-6 px-4 py-10'>
      <BackButton />

      <div className='flex flex-col items-center gap-3'>
        <span className='rounded-full' style={{ backgroundColor: `${typeColor}50` }}>
          <img src={image} alt={name} className='h-56 w-56 object-cover' />
        </span>

        <h2 className='text-4xl font-bold capitalize'>
          {name} <span className='font-mono text-gray-400'>{padId(id)}</span>
        </h2>

        <div className='flex items-center justify-center gap-2'>
          {types.map((type) => {
            const t = type.type.name
            return (
              <Badge
                key={t}
                type={t}
                icon={<IconType letter={t[0]} />}
                color={typesColors[t]?.color}
              />
            )
          })}
        </div>
      </div>

      {flavorText && (
        <blockquote className='max-w-xl rounded-xl bg-white/50 p-4 text-center italic shadow-sm dark:bg-gray-800/50'>
          “{flavorText}”
        </blockquote>
      )}

      <div className='flex w-full max-w-xl flex-col gap-6'>
        <div className='grid grid-cols-2 gap-3'>
          <div className='rounded-xl bg-white p-4 text-center shadow-sm dark:bg-gray-800'>
            <p className='text-sm text-gray-500'>Peso</p>
            <p className='text-xl font-bold'>{pokemon.weight / 10} kg</p>
          </div>
          <div className='rounded-xl bg-white p-4 text-center shadow-sm dark:bg-gray-800'>
            <p className='text-sm text-gray-500'>Altura</p>
            <p className='text-xl font-bold'>{pokemon.height / 10} m</p>
          </div>
        </div>

        {stats && <StatBars stats={stats} />}
        {abilities?.length > 0 && <Abilities abilities={abilities} />}
        <EvolutionChain evolution={evolution} currentName={name} />
      </div>
    </section>
  )
}
