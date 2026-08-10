import { Card } from './Card'
import { EvolutionTree } from './EvolutionTree'
import { Spinner } from './Spinner'
import { StatBlock } from './StatBlock'
import { typeTheme } from '../utils/gradient'

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

export const PokemonOverviewPanel = ({
  flavorText,
  height,
  weight,
  abilities,
  pokemonTypes,
  category,
  captureRate,
  habitat,
  eggGroups,
  regularAbilities,
  hiddenAbilities,
  typeMatchups,
  typeMatchupsStatus,
  typeMatchupsError,
  onRetryTypeMatchups
}) => {
  const hasPhysicalData = height != null && weight != null
  const hasAnyContent = flavorText || hasPhysicalData || abilities?.length > 0

  if (!hasAnyContent) {
    return (
      <Card
        className='flex min-h-[8rem] items-center justify-center p-8'
        tint={typeTheme.contentSurface(pokemonTypes)}
      >
        <p className='text-sm text-muted'>No overview data available.</p>
      </Card>
    )
  }

  return (
    <Card className='flex flex-col gap-4 p-5' tint={typeTheme.contentSurface(pokemonTypes)}>
      <h3 className='text-caption uppercase tracking-wide text-muted'>Pokédex Entry</h3>
      {flavorText && (
        <p className='text-sm leading-relaxed text-gray-700 dark:text-gray-300'>"{flavorText}"</p>
      )}
      {hasPhysicalData && (
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <p className='text-label text-muted'>Altura</p>
            <p className='text-xl font-bold'>{height / 10} m</p>
          </div>
          <div>
            <p className='text-label text-muted'>Peso</p>
            <p className='text-xl font-bold'>{weight / 10} kg</p>
          </div>
        </div>
      )}
      {abilities?.length > 0 && <Abilities abilities={abilities} />}
    </Card>
  )
}

export const PokemonStatsPanel = ({ stats, pokemonTypes }) => {
  if (!stats || stats.length === 0) {
    return (
      <Card
        className='flex min-h-[8rem] items-center justify-center p-8'
        tint={typeTheme.contentSurface(pokemonTypes)}
      >
        <p className='text-sm text-muted'>No stats available.</p>
      </Card>
    )
  }

  return <StatBlock stats={stats} layout='grid' tint={typeTheme.contentSurface(pokemonTypes)} />
}

export const PokemonEvolutionPanel = ({
  evolutionTree,
  evolutionError,
  isEvolutionLoading,
  currentName,
  search,
  typeColor,
  pokemonTypes
}) => {
  let evolutionContent

  if (isEvolutionLoading) {
    evolutionContent = (
      <Card
        className='flex min-h-[8rem] items-center justify-center p-4'
        tint={typeTheme.contentSurface(pokemonTypes)}
      >
        <Spinner />
      </Card>
    )
  } else if (evolutionError) {
    evolutionContent = (
      <Card
        className='flex min-h-[8rem] items-center justify-center p-4'
        tint={typeTheme.contentSurface(pokemonTypes)}
      >
        <p className='text-sm text-muted'>No se pudo cargar la línea evolutiva.</p>
      </Card>
    )
  } else {
    evolutionContent = (
      <Card className='p-4' tint={typeTheme.contentSurface(pokemonTypes)}>
        <EvolutionTree
          tree={evolutionTree}
          currentName={currentName}
          search={search}
          typeColor={typeColor}
        />
      </Card>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h3 className='mb-3 text-caption uppercase tracking-wide text-muted'>Línea evolutiva</h3>
        {evolutionContent}
      </div>
      <div>
        <h3 className='mb-3 text-caption uppercase tracking-wide text-muted'>
          Mega & Special Forms
        </h3>
        <Card
          className='flex min-h-[6rem] items-center justify-center p-4'
          tint={typeTheme.contentSurface(pokemonTypes)}
        >
          <p className='text-center text-sm text-muted'>
            Mega Evolutions and alternate forms will be available in a future phase.
          </p>
        </Card>
      </div>
    </div>
  )
}

export const PokemonMovesPanel = () => (
  <Card className='flex min-h-[8rem] flex-col items-center justify-center gap-2 p-8'>
    <h3 className='text-caption uppercase tracking-wide text-muted'>Moves</h3>
    <p className='text-center text-sm text-muted'>
      Level-up and TM/HM move data will be available in a future phase.
    </p>
  </Card>
)
