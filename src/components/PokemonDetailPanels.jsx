import { Card } from './Card'
import { EvolutionTree } from './EvolutionTree'
import { Spinner } from './Spinner'
import { StatBlock } from './StatBlock'
import { TypeMatchups } from './TypeMatchups'
import { typeTheme } from '../utils/gradient'

export const PokemonOverviewPanel = ({
  flavorText,
  height,
  weight,
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
  // Format height (decimeters to meters)
  const formatHeight = (value) => {
    if (value == null || isNaN(value)) return null
    return `${(value / 10).toFixed(1)} m`
  }

  // Format weight (hectograms to kilograms)
  const formatWeight = (value) => {
    if (value == null || isNaN(value)) return null
    return `${(value / 10).toFixed(1)} kg`
  }

  const formattedHeight = formatHeight(height)
  const formattedWeight = formatWeight(weight)

  return (
    <div className='flex flex-col gap-4'>
      {/* Pokédex Entry - Full Width */}
      <Card className='p-5' tint={typeTheme.contentSurface(pokemonTypes)}>
        <h3 className='text-caption uppercase tracking-wide text-muted'>Pokédex Entry</h3>
        {flavorText
          ? (
            <p className='mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300'>
              {flavorText}
            </p>
            )
          : (
            <p className='mt-2 text-sm text-muted italic'>No Pokédex entry available</p>
            )}
      </Card>

      {/* Biological Data + Abilities - Desktop Two Column */}
      <div className='flex flex-col gap-4 md:flex-row md:items-start'>
        {/* Biological Data */}
        <Card className='flex-1 p-5' tint={typeTheme.contentSurface(pokemonTypes)}>
          <h3 className='text-caption uppercase tracking-wide text-muted'>Biological Data</h3>
          <dl className='mt-3 space-y-3'>
            <div>
              <dt className='text-label text-muted'>Category</dt>
              <dd className='mt-0.5 text-sm text-gray-900 dark:text-gray-100'>
                {category || 'Unknown'}
              </dd>
            </div>

            <div>
              <dt className='text-label text-muted'>Height</dt>
              <dd className='mt-0.5 text-sm text-gray-900 dark:text-gray-100'>
                {formattedHeight || '—'}
              </dd>
            </div>

            <div>
              <dt className='text-label text-muted'>Weight</dt>
              <dd className='mt-0.5 text-sm text-gray-900 dark:text-gray-100'>
                {formattedWeight || '—'}
              </dd>
            </div>

            <div>
              <dt className='text-label text-muted'>Base Catch Rate</dt>
              <dd className='mt-0.5 text-sm text-gray-900 dark:text-gray-100'>
                {captureRate?.display || '—'}
              </dd>
            </div>

            <div>
              <dt className='text-label text-muted'>Habitat</dt>
              <dd className='mt-0.5 text-sm text-gray-900 dark:text-gray-100'>
                {habitat || 'Unknown'}
              </dd>
            </div>

            <div>
              <dt className='text-label text-muted'>Egg Groups</dt>
              <dd className='mt-0.5'>
                {eggGroups && eggGroups.length > 0
                  ? (
                    <div className='flex flex-wrap gap-1.5'>
                      {eggGroups.map((group) => (
                        <span
                          key={group}
                          className='rounded-full bg-gray-100 px-2.5 py-0.5 text-xs dark:bg-gray-800'
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                    )
                  : (
                    <span className='text-sm text-muted italic'>None recorded</span>
                    )}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Abilities */}
        <Card className='flex-1 p-5' tint={typeTheme.contentSurface(pokemonTypes)}>
          <h3 className='text-caption uppercase tracking-wide text-muted'>Abilities</h3>

          <div className='mt-3 space-y-4'>
            {/* Regular Abilities */}
            <div>
              <h4 className='text-label text-muted'>Regular Abilities</h4>
              {regularAbilities && regularAbilities.length > 0
                ? (
                  <div className='mt-1.5 flex flex-wrap gap-1.5'>
                    {regularAbilities.map((ability) => (
                      <span
                        key={ability}
                        className='rounded-full bg-brand-100 px-3 py-1 text-sm capitalize dark:bg-brand-700/40'
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                  )
                : (
                  <p className='mt-1 text-sm text-muted italic'>None recorded</p>
                  )}
            </div>

            {/* Hidden Abilities */}
            <div>
              <h4 className='text-label text-muted'>Hidden Abilities</h4>
              {hiddenAbilities && hiddenAbilities.length > 0
                ? (
                  <div className='mt-1.5 flex flex-wrap gap-1.5'>
                    {hiddenAbilities.map((ability) => (
                      <span
                        key={ability}
                        className='rounded-full bg-purple-100 px-3 py-1 text-sm capitalize dark:bg-purple-700/40'
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                  )
                : (
                  <p className='mt-1 text-sm text-muted italic'>No hidden ability</p>
                  )}
            </div>
          </div>
        </Card>
      </div>

      {/* Type Matchups - Full Width */}
      <TypeMatchups
        groups={typeMatchups?.groups}
        status={typeMatchupsStatus}
        error={typeMatchupsError}
        onRetry={onRetryTypeMatchups}
        pokemonTypes={pokemonTypes}
      />
    </div>
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
