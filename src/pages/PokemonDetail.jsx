import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { EvolutionTree } from '../components/EvolutionTree'
import { FavoriteButton } from '../components/FavoriteButton'
import { Spinner } from '../components/Spinner'
import { StatBlock } from '../components/StatBlock'
import { useAdjacentPokemon } from '../Hooks/useAdjacentPokemon'
import { fetchPokemonDetail, fetchEvolutionChain } from '../slices/thunks'
import { buildEvolutionTree, imageFrom } from '../utils/evolution'
import { TYPES } from '../constants/types'

const imageNotFound =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'

const getSpanishFlavor = (species) => {
  const entry = species?.flavor_text_entries?.find((e) => e.language?.name === 'es')
  return entry?.flavor_text?.replace(/[\f\n]/g, ' ').trim()
}

const padId = (id) => `#${String(id).padStart(3, '0')}`

const ChevronLeft = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-6 w-6 sm:h-8 sm:w-8'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
  </svg>
)

const ChevronRight = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-6 w-6 sm:h-8 sm:w-8'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
  </svg>
)

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
  const navigate = useNavigate()
  const { name } = useParams()
  const { search } = useLocation()
  const [pokemon, setPokemon] = useState(null)
  const [species, setSpecies] = useState(null)
  const [chainDetail, setChainDetail] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const pokemonCache = useSelector((state) => state.pokeState.pokemonCache)

  const evolutionTree = useMemo(
    () => buildEvolutionTree(chainDetail?.chain, pokemonCache),
    [chainDetail, pokemonCache]
  )

  const {
    prevName,
    nextName,
    hasPrev,
    hasNext,
    search: navSearch
  } = useAdjacentPokemon(name, pokemon?.id ?? 0)

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
        setChainDetail(p[1].chainDetail)
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement
      const isTyping =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.isContentEditable

      if (isTyping) return

      if (e.key === 'ArrowLeft' && hasPrev && prevName) {
        navigate(`/pokemon/${prevName}${navSearch}`)
      } else if (e.key === 'ArrowRight' && hasNext && nextName) {
        navigate(`/pokemon/${nextName}${navSearch}`)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigate, prevName, nextName, hasPrev, hasNext, navSearch])

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

      <Card className='relative flex items-stretch overflow-hidden p-3 sm:p-4'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 z-0 [background:var(--hero-grad)] dark:[background:var(--hero-grad-dark)]'
          style={{
            '--hero-grad': `radial-gradient(ellipse at 50% 40%, ${typeColor}40 0%, transparent 70%)`,
            '--hero-grad-dark': `radial-gradient(ellipse at 50% 40%, ${typeColor}55 0%, transparent 70%)`
          }}
        />

        <button
          type='button'
          aria-label='Pokémon anterior'
          aria-disabled={!hasPrev}
          disabled={!hasPrev}
          onClick={() => navigate(`/pokemon/${prevName}${navSearch}`)}
          className='dark:hover:text-brand-400 relative z-10 flex shrink-0 items-center justify-center self-center rounded-full p-1.5 text-muted transition-colors hover:bg-gray-100 hover:text-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-gray-700'
        >
          <ChevronLeft />
        </button>

        <div className='relative z-10 flex flex-1 flex-col items-center justify-center gap-3 sm:gap-4'>
          <span
            className='shrink-0 rounded-full bg-[var(--sprite-tint)] dark:bg-[var(--sprite-tint-dark)]'
            style={{ '--sprite-tint': `${typeColor}50`, '--sprite-tint-dark': `${typeColor}60` }}
          >
            <img src={image} alt={name} className='h-36 w-36 object-cover sm:h-48 sm:w-48' />
          </span>

          <div className='flex flex-col items-center gap-1.5 text-center'>
            <div className='flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1'>
              <h1 className='text-display capitalize tracking-tight text-gray-900 dark:text-gray-100 sm:text-[40px] sm:leading-[44px]'>
                {name}
              </h1>
              <span className='rounded-full bg-gray-100 px-2.5 py-0.5 font-mono text-caption text-gray-500 dark:bg-gray-700 dark:text-gray-300'>
                {padId(id)}
              </span>
            </div>

            <div className='flex flex-wrap justify-center gap-2'>
              {types.map((type) => {
                const t = type.type.name
                return <Badge key={t} type={t} {...TYPES[t]} />
              })}
            </div>
          </div>
        </div>

        <button
          type='button'
          aria-label='Pokémon siguiente'
          aria-disabled={!hasNext}
          disabled={!hasNext}
          onClick={() => navigate(`/pokemon/${nextName}${navSearch}`)}
          className='dark:hover:text-brand-400 relative z-10 flex shrink-0 items-center justify-center self-center rounded-full p-1.5 text-muted transition-colors hover:bg-gray-100 hover:text-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-gray-700'
        >
          <ChevronRight />
        </button>

        <FavoriteButton name={name} className='absolute right-3 top-3 z-20' />
      </Card>

      <div className='grid grid-cols-1 gap-4 lg:items-start lg:grid-cols-[1fr_1.2fr_0.9fr] lg:gap-5'>
        <Card className='flex flex-col gap-4 p-5'>
          <h3 className='text-caption uppercase tracking-wide text-muted'>Pokédex Entry</h3>
          {flavorText && (
            <p className='text-sm leading-relaxed text-gray-700 dark:text-gray-300'>
              “{flavorText}”
            </p>
          )}

          <div className='grid grid-cols-2 gap-3'>
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

        <div>
          <StatBlock stats={stats} layout='grid' />
        </div>

        <div className='flex flex-col'>
          <h3 className='mb-3 text-caption uppercase tracking-wide text-muted'>Línea evolutiva</h3>
          <Card className='p-4 lg:max-h-[16rem] lg:overflow-y-auto'>
            <EvolutionTree
              tree={evolutionTree}
              currentName={name}
              search={search}
              typeColor={typeColor}
            />
          </Card>
        </div>
      </div>
    </section>
  )
}
