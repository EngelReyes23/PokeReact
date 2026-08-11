import { Badge } from './Badge'
import { Card } from './Card'
import { Spinner } from './Spinner'
import { TYPES } from '../constants/types'
import { typeTheme } from '../utils/gradient'

const capitalizeTypeName = (name) => name.charAt(0).toUpperCase() + name.slice(1)

const TypeMatchupGroup = ({ title, types, pokemonTypes }) => {
  const hasTypes = types && types.length > 0

  return (
    <div className='rounded-lg bg-white/40 p-3 dark:bg-gray-900/20'>
      <h4 className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300'>
        {title}
      </h4>
      {hasTypes
        ? (
          <ul className='flex flex-wrap gap-2'>
            {types.map((typeName) => (
              <li key={typeName} className='inline-flex items-center gap-1.5'>
                <Badge type={capitalizeTypeName(typeName)} {...TYPES[typeName]} />
                <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  {title.includes('4×') && '4×'}
                  {title.includes('2×') && '2×'}
                  {title.includes('½×') && '½×'}
                  {title.includes('¼×') && '¼×'}
                  {title.includes('0×') && '0×'}
                </span>
              </li>
            ))}
          </ul>
          )
        : (
          <p className='text-sm text-gray-500 dark:text-gray-500'>None</p>
          )}
    </div>
  )
}

export const TypeMatchups = ({ groups, status, error, onRetry, pokemonTypes }) => {
  if (status === 'loading') {
    return (
      <Card
        className='flex min-h-[8rem] flex-col items-center justify-center gap-3 p-8'
        tint={typeTheme.contentSurface(pokemonTypes)}
      >
        <Spinner />
        <p className='text-sm text-muted'>Loading type matchups...</p>
      </Card>
    )
  }

  if (status === 'error') {
    return (
      <Card
        className='flex min-h-[8rem] flex-col items-center justify-center gap-3 p-8'
        tint={typeTheme.contentSurface(pokemonTypes)}
      >
        <p className='text-sm text-gray-700 dark:text-gray-300'>Unable to load type matchups</p>
        <button
          type='button'
          onClick={onRetry}
          className='rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
        >
          Retry
        </button>
      </Card>
    )
  }

  if (status === 'success' && !groups) {
    return (
      <Card
        className='flex min-h-[8rem] items-center justify-center p-8'
        tint={typeTheme.contentSurface(pokemonTypes)}
      >
        <p className='text-sm text-muted'>Type matchups unavailable</p>
      </Card>
    )
  }

  if (status === 'idle' || !groups) {
    return (
      <Card
        className='flex min-h-[8rem] items-center justify-center p-8'
        tint={typeTheme.contentSurface(pokemonTypes)}
      >
        <p className='text-sm text-muted'>Type matchups not available</p>
      </Card>
    )
  }

  return (
    <Card className='flex flex-col gap-4 p-5' tint={typeTheme.contentSurface(pokemonTypes)}>
      <h3 className='text-caption uppercase tracking-wide text-muted'>Type Matchups</h3>

      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
        <TypeMatchupGroup
          title='4× Weaknesses'
          types={groups.fourTimesWeaknesses}
          pokemonTypes={pokemonTypes}
        />
        <TypeMatchupGroup
          title='2× Weaknesses'
          types={groups.twoTimesWeaknesses}
          pokemonTypes={pokemonTypes}
        />
        <TypeMatchupGroup
          title='½× Resistances'
          types={groups.halfResistances}
          pokemonTypes={pokemonTypes}
        />
        <TypeMatchupGroup
          title='¼× Resistances'
          types={groups.quarterResistances}
          pokemonTypes={pokemonTypes}
        />
        <TypeMatchupGroup
          title='0× Immunities'
          types={groups.immunities}
          pokemonTypes={pokemonTypes}
        />
      </div>
    </Card>
  )
}
