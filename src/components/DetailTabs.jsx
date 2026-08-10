import { useSearchParams } from 'react-router-dom'
import { Card } from './Card'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'stats', label: 'Stats' },
  { id: 'evolution', label: 'Evolution & Forms' },
  { id: 'moves', label: 'Moves' }
]

const VALID_TABS = TABS.map((tab) => tab.id)

const Placeholder = ({ title }) => (
  <Card className='flex min-h-[12rem] items-center justify-center p-8'>
    <p className='text-sm text-muted'>{title}</p>
  </Card>
)

export const DetailTabs = ({ renderPanel }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab')
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : 'overview'

  const handleClick = (tabId) => {
    const next = new URLSearchParams(searchParams)
    next.set('tab', tabId)
    setSearchParams(next, { replace: false })
  }

  const renderContent = (tabId) => {
    if (renderPanel) {
      return renderPanel(tabId)
    }
    const tab = TABS.find((t) => t.id === tabId)
    return <Placeholder title={`${tab?.label || tabId} — content coming soon`} />
  }

  return (
    <div className='flex flex-col'>
      <div
        role='tablist'
        aria-label='Pokemon detail sections'
        className='flex gap-2 overflow-x-auto pb-1'
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type='button'
              role='tab'
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={0}
              onClick={() => handleClick(tab.id)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
                isActive
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-gray-300 bg-surface text-gray-700 hover:border-brand-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-brand-400'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className='mt-4'>
        {TABS.map((tab) => (
          <div
            key={tab.id}
            role='tabpanel'
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== activeTab}
            tabIndex={0}
          >
            {renderContent(tab.id)}
          </div>
        ))}
      </div>
    </div>
  )
}
