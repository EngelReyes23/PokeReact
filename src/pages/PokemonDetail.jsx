import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { DetailTabs } from '../components/DetailTabs'
import { FavoriteButton } from '../components/FavoriteButton'
import { PokemonAppearanceToggle } from '../components/PokemonAppearanceToggle'
import {
  PokemonEvolutionPanel,
  PokemonMovesPanel,
  PokemonOverviewPanel,
  PokemonStatsPanel
} from '../components/PokemonDetailPanels'
import { Spinner } from '../components/Spinner'
import { useAdjacentPokemon } from '../Hooks/useAdjacentPokemon'
import { fetchPokemonDetail, fetchEvolutionChain, fetchTypeRelations } from '../slices/thunks'
import { buildEvolutionTree } from '../utils/evolution'
import { hasShinySprite, resolvePokemonSprite } from '../utils/sprites'
import { TYPES } from '../constants/types'
import { typeTheme } from '../utils/gradient'
import { DetailThemeContext } from '../contexts/detailTheme'
import {
  getEnglishFlavorText,
  getPokemonCategory,
  formatCatchRate,
  formatEggGroups,
  splitAbilities
} from '../utils/pokemonDetails'
import { calculateTypeMatchups } from '../utils/typeMatchups'

const imageNotFound =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'

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

export const PokemonDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { name } = useParams()
  const { search } = useLocation()
  const [pokemon, setPokemon] = useState(null)
  const [species, setSpecies] = useState(null)
  const [chainDetail, setChainDetail] = useState(null)
  const [error, setError] = useState(null)
  const [evolutionError, setEvolutionError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEvolutionLoading, setIsEvolutionLoading] = useState(true)
  const [appearance, setAppearance] = useState('normal')
  const [typeMatchups, setTypeMatchups] = useState(null)
  const [typeMatchupsStatus, setTypeMatchupsStatus] = useState('idle')
  const [typeMatchupsError, setTypeMatchupsError] = useState(null)

  const pokemonCache = useSelector((state) => state.pokeState.pokemonCache)
  const setDetailTheme = useContext(DetailThemeContext)

  // Request sequence for Type Matchups stale-protection
  const typeMatchupsSequenceRef = useRef(0)

  // Normalize route name once for all route-safe comparisons
  const normalizedRouteName = useMemo(() => {
    return typeof name === 'string' ? name.trim().toLowerCase() : ''
  }, [name])

  // Check if current pokemon belongs to the current route
  const isCurrentPokemon = useMemo(() => {
    if (!pokemon || !normalizedRouteName) return false
    if (typeof pokemon.name !== 'string') return false
    return pokemon.name.trim().toLowerCase() === normalizedRouteName
  }, [pokemon, normalizedRouteName])

  // Derive stable defensive type identity from pokemon.types (only when pokemon matches route)
  const defensiveTypeKey = useMemo(() => {
    if (!isCurrentPokemon || !pokemon?.types) return null
    const types = pokemon.types
      .map((t) => t.type.name)
      .filter((typeName) => typeof typeName === 'string' && typeName.trim().length > 0)
      .map((typeName) => typeName.trim().toLowerCase())
    return types.length > 0 ? types.join('|') : null
  }, [isCurrentPokemon, pokemon])

  // Effective Species: route-safe local species or fallback to cache for current route name
  const effectiveSpecies = useMemo(() => {
    if (!normalizedRouteName) return null
    // Local species only if it belongs to current route
    if (species && typeof species.name === 'string') {
      if (species.name.trim().toLowerCase() === normalizedRouteName) return species
    }
    // Fallback to cache for current route only
    const cached = pokemonCache[normalizedRouteName]?.species
    if (cached && typeof cached.name === 'string') {
      if (cached.name.trim().toLowerCase() === normalizedRouteName) return cached
    }
    return null
  }, [species, normalizedRouteName, pokemonCache])

  const evolutionTree = useMemo(
    () => buildEvolutionTree(chainDetail?.chain, pokemonCache),
    [chainDetail, pokemonCache]
  )

  // Shared Type Matchups load function (stable callback)
  const loadTypeMatchups = useCallback(
    async (types, sequenceId) => {
      // Check ownership BEFORE clearing state
      if (typeMatchupsSequenceRef.current !== sequenceId) return

      // Clear stale state
      setTypeMatchups(null)
      setTypeMatchupsError(null)
      setTypeMatchupsStatus('loading')

      try {
        const results = await Promise.allSettled(
          types.map((type) => dispatch(fetchTypeRelations(type)))
        )

        // Check if this is still the current sequence
        if (typeMatchupsSequenceRef.current !== sequenceId) return

        const allSucceeded = results.every((result) => result.status === 'fulfilled')

        if (!allSucceeded) {
          const failedTypes = types.filter((_, index) => results[index].status === 'rejected')
          setTypeMatchupsError(
            new Error(`Failed to load type relations for: ${failedTypes.join(', ')}`)
          )
          setTypeMatchupsStatus('error')
          setTypeMatchups(null)
          return
        }

        const relations = {}
        types.forEach((type, index) => {
          relations[type] = results[index].value
        })

        const result = calculateTypeMatchups({ defensiveTypes: types, relationsByType: relations })
        if (result.complete) {
          setTypeMatchups(result.matchups)
          setTypeMatchupsStatus('success')
        } else {
          setTypeMatchupsError(
            new Error(`Incomplete type relations: ${result.missingDefensiveTypes.join(', ')}`)
          )
          setTypeMatchupsStatus('error')
          setTypeMatchups(null)
        }
      } catch (error) {
        if (typeMatchupsSequenceRef.current !== sequenceId) return
        setTypeMatchupsError(error)
        setTypeMatchupsStatus('error')
        setTypeMatchups(null)
      }
    },
    [dispatch]
  )

  // Automatic Type Matchups loading
  useEffect(() => {
    if (!defensiveTypeKey || !normalizedRouteName) {
      typeMatchupsSequenceRef.current += 1 // Invalidate
      setTypeMatchups(null)
      setTypeMatchupsError(null)
      setTypeMatchupsStatus('idle')
      return
    }

    const types = defensiveTypeKey.split('|')
    const sequenceId = ++typeMatchupsSequenceRef.current

    loadTypeMatchups(types, sequenceId)
  }, [defensiveTypeKey, normalizedRouteName, loadTypeMatchups])

  // Explicit unmount invalidation for Type Matchups
  useEffect(() => {
    return () => {
      typeMatchupsSequenceRef.current += 1
    }
  }, [])

  // Retry callback (stable)
  const retryTypeMatchups = useCallback(async () => {
    if (!defensiveTypeKey) return

    const types = defensiveTypeKey.split('|')
    const sequenceId = ++typeMatchupsSequenceRef.current

    loadTypeMatchups(types, sequenceId)
  }, [defensiveTypeKey, loadTypeMatchups])

  // Prepare data for Expanded Overview (route-safe)
  const overviewData = useMemo(() => {
    if (!isCurrentPokemon || !pokemon) return null

    const flavorText = effectiveSpecies ? getEnglishFlavorText(effectiveSpecies) : null
    const category = effectiveSpecies ? getPokemonCategory(effectiveSpecies) : null
    const captureRate = effectiveSpecies ? formatCatchRate(effectiveSpecies.capture_rate) : null
    const eggGroups = effectiveSpecies ? formatEggGroups(effectiveSpecies.egg_groups) : []
    const { regular: regularAbilities, hidden: hiddenAbilities } = splitAbilities(pokemon.abilities)

    return {
      flavorText,
      category,
      height: pokemon.height,
      weight: pokemon.weight,
      captureRate,
      habitat: effectiveSpecies?.habitat?.name || null,
      eggGroups,
      regularAbilities,
      hiddenAbilities,
      pokemonTypes: pokemon.types.map((t) => t.type.name),
      typeMatchups,
      typeMatchupsStatus,
      typeMatchupsError
    }
  }, [
    isCurrentPokemon,
    pokemon,
    effectiveSpecies,
    typeMatchups,
    typeMatchupsStatus,
    typeMatchupsError
  ])

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
      setIsEvolutionLoading(true)
      setError(null)
      setEvolutionError(null)
      setPokemon(null)
      setSpecies(null)
      setChainDetail(null)

      const pokemonPromise = dispatch(fetchPokemonDetail(name))
        .then((result) => {
          if (active) setPokemon(result)
        })
        .catch((err) => {
          if (active) setError(err)
        })
        .finally(() => {
          if (active) setIsLoading(false)
        })

      const evolutionPromise = dispatch(fetchEvolutionChain(name))
        .then((result) => {
          if (active) {
            setSpecies(result.species)
            setChainDetail(result.chainDetail)
          }
        })
        .catch((err) => {
          if (active) setEvolutionError(err)
        })
        .finally(() => {
          if (active) setIsEvolutionLoading(false)
        })

      await Promise.allSettled([pokemonPromise, evolutionPromise])
    }

    load()

    return () => {
      active = false
    }
  }, [dispatch, name])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement
      const inTablist = activeEl?.closest?.('[role="tablist"]')
      const isTyping =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'SELECT' ||
        activeEl?.isContentEditable

      if (inTablist || isTyping) return

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

  // Si aparece shiny pero el pokemon cargado no tiene ninguna fuente shiny valida,
  // vuelve a normal. Solo se aplica cuando el pokemon coincide con la ruta actual,
  // evitando reseteos por respuestas obsoletas durante navegacion rapida.
  useEffect(() => {
    if (
      appearance === 'shiny' &&
      pokemon &&
      pokemon.name === name &&
      !hasShinySprite(pokemon.sprites)
    ) {
      setAppearance('normal')
    }
  }, [appearance, pokemon, name])

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
  const image = resolvePokemonSprite(pokemon.sprites, appearance, imageNotFound)
  const hasShiny = hasShinySprite(pokemon.sprites)
  const mainType = types[0]?.type?.name
  const typeColor = TYPES[mainType]?.color || TYPES.bug.color

  const renderPanel = (tabId) => {
    switch (tabId) {
      case 'overview':
        return (
          <PokemonOverviewPanel
            flavorText={overviewData?.flavorText}
            height={overviewData?.height}
            weight={overviewData?.weight}
            abilities={abilities}
            pokemonTypes={pokemonTypes}
            category={overviewData?.category}
            captureRate={overviewData?.captureRate}
            habitat={overviewData?.habitat}
            eggGroups={overviewData?.eggGroups}
            regularAbilities={overviewData?.regularAbilities}
            hiddenAbilities={overviewData?.hiddenAbilities}
            typeMatchups={overviewData?.typeMatchups}
            typeMatchupsStatus={overviewData?.typeMatchupsStatus}
            typeMatchupsError={overviewData?.typeMatchupsError}
            onRetryTypeMatchups={retryTypeMatchups}
          />
        )
      case 'stats':
        return <PokemonStatsPanel stats={stats} pokemonTypes={pokemonTypes} />
      case 'evolution':
        return (
          <PokemonEvolutionPanel
            evolutionTree={evolutionTree}
            evolutionError={evolutionError}
            isEvolutionLoading={isEvolutionLoading}
            currentName={name}
            search={search}
            typeColor={typeColor}
            pokemonTypes={pokemonTypes}
          />
        )
      case 'moves':
        return <PokemonMovesPanel />
      default:
        return null
    }
  }

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
                <div className='flex justify-center md:justify-start'>
                  <PokemonAppearanceToggle
                    appearance={appearance}
                    onChange={setAppearance}
                    hasShiny={hasShiny}
                  />
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

        <DetailTabs renderPanel={renderPanel} />
      </section>
    </div>
  )
}
