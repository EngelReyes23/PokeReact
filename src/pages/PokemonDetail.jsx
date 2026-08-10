import { useContext, useEffect, useMemo, useState } from 'react'
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
import { typeTheme } from '../utils/gradient'
import { DetailThemeContext } from '../contexts/detailTheme'

const imageNotFound =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'

const padId = (id) => `#${String(id).padStart(3, '0')}`

const getSpanishFlavor = (species) => {
  const entry = species?.flavor_text_entries?.find((e) => e.language?.name === 'es')
  return entry?.flavor_text?.replace(/[\f\n]/g, ' ').trim()
}

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
  const setDetailTheme = useContext(DetailThemeContext)

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

  // Publica la superficie del footer mientras el detalle esta montado
  useEffect(() => {
    if (setDetailTheme && pokemon) {
      setDetailTheme({
        footer: typeTheme.footerSurface(pokemon.types.map((t) => t.type.name))
      })
    }
    return () => setDetailTheme?.(null)
  }, [setDetailTheme, pokemon])

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
  const pokemonTypes = types.map((type) => type.type.name)
  const image = imageFrom(pokemon.sprites) || imageNotFound
  const mainType = types[0]?.type?.name
  const typeColor = TYPES[mainType]?.color || TYPES.bug.color
  const flavorText = getSpanishFlavor(species)

  return (
    <div className='relative isolate flex flex-1 flex-col [--detail-focal:50%_32%] [--detail-focal-accent:50%_26%] md:[--detail-focal:36%_50%] md:[--detail-focal-accent:36%_44%]'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-10'
        style={typeTheme.pageBackground(pokemonTypes)}
      />
      <section className='container mx-auto flex flex-col gap-4 px-4 py-6 text-gray-900 dark:text-gray-100'>
        <BackButton search={search} />

        <Card tint={typeTheme.heroSurface(pokemonTypes)}>
          <FavoriteButton name={name} className='absolute right-3 top-3 z-20' />

          <button
            type='button'
            aria-label='Pokémon anterior'
            aria-disabled={!hasPrev}
            disabled={!hasPrev}
            onClick={() => navigate(`/pokemon/${prevName}${navSearch}`)}
            className='absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/40 text-muted shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/70 hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-40 dark:bg-gray-900/40 dark:hover:bg-gray-800/70 dark:hover:text-brand-400 sm:left-4'
          >
            <ChevronLeft />
          </button>

          <button
            type='button'
            aria-label='Pokémon siguiente'
            aria-disabled={!hasNext}
            disabled={!hasNext}
            onClick={() => navigate(`/pokemon/${nextName}${navSearch}`)}
            className='absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/40 text-muted shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/70 hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-40 dark:bg-gray-900/40 dark:hover:bg-gray-800/70 dark:hover:text-brand-400 sm:right-4'
          >
            <ChevronRight />
          </button>

          {/* Desktop: centered stage so the hero reads as one composition instead of the mobile layout stretched wide */}
          <div className='relative z-10 mx-auto w-full md:max-w-4xl'>
            <div className='grid grid-cols-1 items-center gap-5 px-12 py-8 sm:px-20 sm:py-10 md:grid-cols-[auto_minmax(0,1fr)] md:gap-8 md:px-8 md:py-6 lg:gap-10 lg:px-10 lg:py-7'>
              {/* Artwork stage: sits left of the identity stage so the halo bleeds into it */}
              <div className='relative flex min-w-0 items-center justify-center'>
                <div
                  aria-hidden='true'
                  className='pointer-events-none absolute h-[140%] w-[140%] rounded-full'
                  style={typeTheme.artworkHalo(pokemonTypes)}
                />
                <img
                  src={image}
                  alt={name}
                  className='relative h-52 w-52 object-contain drop-shadow-2xl sm:h-64 sm:w-64'
                />
              </div>

              {/* Identity stage: name + type badges vertically centered against the artwork */}
              <div className='relative flex min-w-0 flex-col items-center gap-2 text-center md:items-start md:text-left'>
                <h1 className='max-w-full break-words text-display capitalize tracking-tight text-gray-900 dark:text-gray-100 sm:text-[44px] sm:leading-[48px]'>
                  {name}
                </h1>
                <div className='flex flex-wrap justify-center gap-2 md:justify-start'>
                  {types.map((type) => {
                    const t = type.type.name
                    return <Badge key={t} type={t} {...TYPES[t]} />
                  })}
                </div>
              </div>
            </div>

            {/* Dex-number watermark: lower-right corner on mobile, tucked beside the identity stage on desktop */}
            <span
              aria-hidden='true'
              className='pointer-events-none absolute -bottom-2 right-2 select-none text-5xl font-bold leading-none tracking-tighter opacity-10 dark:opacity-20 sm:right-3 sm:text-6xl md:bottom-0 md:right-0 md:text-[110px] lg:text-[130px]'
              style={{ color: typeColor }}
            >
              {padId(id)}
            </span>
          </div>
        </Card>

        <div className='grid grid-cols-1 gap-4 lg:items-start lg:grid-cols-[1fr_1.2fr_0.9fr] lg:gap-5'>
          <Card className='flex flex-col gap-4 p-5' tint={typeTheme.contentSurface(pokemonTypes)}>
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
            <StatBlock stats={stats} layout='grid' tint={typeTheme.contentSurface(pokemonTypes)} />
          </div>

          <div className='flex flex-col'>
            <h3 className='mb-3 text-caption uppercase tracking-wide text-muted'>
              Línea evolutiva
            </h3>
            <Card
              className='p-4 lg:max-h-[16rem] lg:overflow-y-auto'
              tint={typeTheme.contentSurface(pokemonTypes)}
            >
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
    </div>
  )
}
