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
  <section className='w-full'>
    <h3 className='mb-3 text-caption uppercase tracking-wide text-muted'>Habilidades</h3>
    <ul className='flex flex-wrap gap-2'>
      {abilities.map(({ ability, is_hidden: isHidden }) => (
        <li
          key={ability.name}
          className='dark:bg-brand-900 rounded-full bg-brand-100 px-4 py-1.5 capitalize'
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
    <h3 className='mb-3 text-caption uppercase tracking-wide text-muted'>Línea evolutiva</h3>
    {evolution.length
      ? (
        <div className='flex flex-col items-center gap-2'>
          {evolution.map((evo, i) => (
            <div key={evo.id} className='flex flex-col items-center gap-2'>
              {i > 0 && (
                <div className='flex items-center gap-2 text-sm text-muted'>
                  <span className='text-base leading-none'>↓</span>
                  <span className='italic'>{evo.condition || 'Desconocido'}</span>
                </div>
              )}
              <Card
                as={Link}
                to={`/pokemon/${evo.name}`}
                className={`flex w-44 flex-col items-center gap-1 p-3 transition-transform hover:scale-105 ${
                evo.name === currentName ? 'ring-2 ring-brand-500' : ''
              }`}
              >
                <img src={evo.sprite} alt={evo.name} className='h-20 w-20 object-contain' />
                <span className='text-sm font-semibold capitalize'>{evo.name}</span>
              </Card>
            </div>
          ))}
        </div>
        )
      : (
        <p className='text-sm text-muted'>Sin cadena evolutiva.</p>
        )}
  </section>
)

export const PokemonDetail = () => {
  const dispatch = useDispatch()
  const { name } = useParams()
  const { search } = useLocation()
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
    <section className='container mx-auto flex flex-col items-center gap-6 px-4 py-10 text-gray-900 dark:text-gray-100'>
      <BackButton search={search} />

      <div className='flex flex-col items-center gap-3'>
        <span className='rounded-full' style={{ backgroundColor: `${typeColor}50` }}>
          <img src={image} alt={name} className='h-56 w-56 object-cover' />
        </span>

        <h2 className='text-h1 capitalize text-gray-900 dark:text-gray-100'>
          {name} <span className='font-mono text-gray-400'>{padId(id)}</span>
        </h2>

        <div className='flex items-center justify-center gap-2'>
          {types.map((type) => {
            const t = type.type.name
            return <Badge key={t} type={t} {...(TYPES[t] || {})} />
          })}
        </div>
      </div>

      {flavorText && (
        <blockquote className='max-w-xl rounded-lg bg-white/50 p-4 text-center italic shadow-md dark:bg-gray-800/50'>
          “{flavorText}”
        </blockquote>
      )}

      <div className='flex w-full max-w-xl flex-col gap-6'>
        <div className='grid grid-cols-2 gap-3'>
          <Card className='p-4 text-center'>
            <p className='text-label text-muted'>Peso</p>
            <p className='text-xl font-bold'>{pokemon.weight / 10} kg</p>
          </Card>
          <Card className='p-4 text-center'>
            <p className='text-label text-muted'>Altura</p>
            <p className='text-xl font-bold'>{pokemon.height / 10} m</p>
          </Card>
        </div>

        {stats && <StatBlock stats={stats} layout='grid' />}
        {abilities?.length > 0 && <Abilities abilities={abilities} />}
        <EvolutionChain evolution={evolution} currentName={name} />
      </div>
    </section>
  )
}
