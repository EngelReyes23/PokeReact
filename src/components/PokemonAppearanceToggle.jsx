export const PokemonAppearanceToggle = ({ appearance, onChange, hasShiny }) => {
  const selected =
    'h-9 rounded-full px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 bg-brand-500 text-white'
  const unselected =
    'h-9 rounded-full border border-gray-300 bg-surface px-3 text-xs font-semibold text-gray-700 transition-colors hover:border-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-brand-400'
  const disabledExtra = ' cursor-not-allowed opacity-50'

  return (
    <div role='group' aria-label='Pokemon appearance' className='inline-flex gap-1'>
      <button
        type='button'
        aria-pressed={appearance === 'normal'}
        aria-label='Show normal appearance'
        onClick={() => onChange('normal')}
        className={appearance === 'normal' ? selected : unselected}
      >
        Normal
      </button>
      <button
        type='button'
        aria-pressed={appearance === 'shiny'}
        aria-label='Show shiny appearance'
        disabled={!hasShiny}
        onClick={() => onChange('shiny')}
        className={`${appearance === 'shiny' ? selected : unselected}${
          !hasShiny ? disabledExtra : ''
        }`}
      >
        Shiny
      </button>
    </div>
  )
}
