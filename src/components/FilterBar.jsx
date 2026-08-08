import { useSearchParams } from 'react-router-dom'
import { HeartIcon } from './FavoriteButton'
import { IconType } from './IconType'
import { TYPES } from '../constants/types'

const GENERATIONS = [
  { id: '1', label: 'Kanto' },
  { id: '2', label: 'Johto' },
  { id: '3', label: 'Hoenn' },
  { id: '4', label: 'Sinnoh' },
  { id: '5', label: 'Unova' },
  { id: '6', label: 'Kalos' },
  { id: '7', label: 'Alola' },
  { id: '8', label: 'Galar' },
  { id: '9', label: 'Paldea' }
]

const SORTS = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Nombre A-Z' },
  { id: 'stat', label: 'Total stats' }
]

export const FilterBar = ({ total }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTypes = (searchParams.get('type') || '').split(',').filter(Boolean)
  const generation = searchParams.get('gen') || ''
  const sortBy = searchParams.get('sort') || 'id'
  const favOnly = searchParams.get('fav') === '1'

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams)
    updates.forEach(({ key, value }) => {
      if (value === '' || value == null) next.delete(key)
      else next.set(key, value)
    })
    setSearchParams(next, { replace: false })
  }

  const toggleType = (type) => {
    const next = activeTypes.includes(type)
      ? activeTypes.filter((t) => t !== type)
      : [...activeTypes, type]
    updateParams([{ key: 'type', value: next.join(',') }])
  }

  const toggleGeneration = (id) => {
    updateParams([{ key: 'gen', value: generation === id ? null : id }])
  }

  const toggleFavOnly = () => {
    updateParams([{ key: 'fav', value: favOnly ? null : '1' }])
  }

  const clearFilters = () => {
    updateParams([
      { key: 'search', value: null },
      { key: 'type', value: null },
      { key: 'gen', value: null },
      { key: 'fav', value: null },
      { key: 'sort', value: 'id' },
      { key: 'page', value: null }
    ])
  }

  const hasFilters =
    Boolean(searchParams.get('search')) || activeTypes.length > 0 || generation || favOnly

  return (
    <div className='mx-auto flex w-full max-w-[1700px] flex-col gap-4 px-4 py-4'>
      <div className='flex flex-wrap items-center gap-2'>
        <span className='text-sm font-semibold text-gray-500 dark:text-gray-400'>Tipo:</span>
        {Object.entries(TYPES).map(([type, { color, letter }]) => {
          const isActive = activeTypes.includes(type)
          return (
            <button
              key={type}
              type='button'
              aria-pressed={isActive}
              onClick={() => toggleType(type)}
              className='flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2'
              style={{
                color,
                borderColor: color,
                backgroundColor: isActive ? `${color}40` : 'transparent'
              }}
            >
              <IconType letter={letter} />
              <span className='capitalize'>{type}</span>
            </button>
          )
        })}
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <span className='text-sm font-semibold text-gray-500 dark:text-gray-400'>Generación:</span>
        {GENERATIONS.map(({ id, label }) => {
          const isActive = generation === id
          return (
            <button
              key={id}
              type='button'
              aria-pressed={isActive}
              onClick={() => toggleGeneration(id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                isActive
                  ? 'border-purple-500 bg-purple-500 text-white'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-purple-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              Gen {label} ({id})
            </button>
          )
        })}
      </div>

      <div className='flex flex-wrap items-center gap-4'>
        <button
          type='button'
          aria-pressed={favOnly}
          onClick={toggleFavOnly}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
            favOnly
              ? 'border-red-500 bg-red-500 text-white'
              : 'border-gray-300 bg-white text-gray-600 hover:border-red-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          <HeartIcon filled={favOnly} />
          <span>Solo favoritos</span>
        </button>

        <label className='flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400'>
          Ordenar por:
          <select
            value={sortBy}
            onChange={(e) => updateParams([{ key: 'sort', value: e.target.value || null }])}
            className='rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 outline-none focus:border-purple-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
          >
            {SORTS.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <span className='text-sm font-semibold text-gray-500 dark:text-gray-400'>
          {total} Pokémon
        </span>

        {hasFilters && (
          <button
            type='button'
            onClick={clearFilters}
            className='rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-600'
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}
