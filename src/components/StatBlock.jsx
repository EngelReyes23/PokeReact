import { Card } from './Card'

export const STAT_LABELS = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'Spe'
}

const StatBar = ({ value }) => (
  <div className='h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600'>
    <div
      className='h-full rounded-full bg-brand-500'
      style={{ width: `${Math.min(100, value)}%` }}
    />
  </div>
)

const StatRow = ({ label, value }) => (
  <div className='flex items-center gap-2 text-sm'>
    <span className='w-8 shrink-0 text-caption tracking-wide text-muted'>{label}</span>
    <StatBar value={value} />
    <span className='w-6 shrink-0 text-right font-semibold text-gray-900 dark:text-gray-100'>
      {value}
    </span>
  </div>
)

const StatCell = ({ label, value }) => (
  <Card className='flex flex-col gap-1 p-3'>
    <span className='text-caption uppercase tracking-wide text-muted'>{label}</span>
    <div className='flex items-center gap-2'>
      <span className='w-10 shrink-0 text-h2 text-gray-900 dark:text-gray-100'>{value}</span>
      <StatBar value={value} />
    </div>
  </Card>
)

// Shared stats block: `list` for the modal, `grid` (2x3) for the detail dashboard.
export const StatBlock = ({ stats, layout = 'list' }) => {
  const items = (stats || []).map((stat) => ({
    key: stat.stat.name,
    label: STAT_LABELS[stat.stat.name] || stat.stat.name,
    value: stat.base_stat
  }))

  return (
    <section className='w-full'>
      <h3 className='mb-3 text-caption uppercase tracking-wide text-muted'>Stats</h3>
      {layout === 'grid'
        ? (
          <div className='grid grid-cols-2 gap-2'>
            {items.map(({ key, label, value }) => (
              <StatCell key={key} label={label} value={value} />
            ))}
          </div>
          )
        : (
          <div className='space-y-1'>
            {items.map(({ key, label, value }) => (
              <StatRow key={key} label={label} value={value} />
            ))}
          </div>
          )}
    </section>
  )
}
