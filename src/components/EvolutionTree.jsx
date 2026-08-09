import { Link } from 'react-router-dom'

const TriggerBadge = ({ trigger }) => (
  <span className='shrink-0 rounded-full bg-surface px-2 py-0.5 text-xs text-muted shadow-sm'>
    {trigger}
  </span>
)

const EvolutionNode = ({ node, currentName, search, typeColor }) => {
  const isCurrent = node.name === currentName

  const content = (
    <div
      className={`flex items-center gap-2 rounded-full px-2 py-1 transition-transform ${
        isCurrent ? 'ring-2 ring-brand-500' : 'hover:scale-105'
      }`}
      style={typeColor ? { backgroundColor: `${typeColor}18` } : {}}
    >
      <img
        src={node.spriteUrl}
        alt={node.name}
        className='h-10 w-10 object-contain'
        loading='lazy'
        decoding='async'
      />
      <span
        className={`capitalize ${
          isCurrent
            ? 'font-semibold text-brand-600 dark:text-brand-400'
            : 'text-gray-900 dark:text-gray-100'
        }`}
      >
        {node.name}
      </span>
    </div>
  )

  if (isCurrent) return content

  return (
    <Link
      to={`/pokemon/${node.name}${search}`}
      className='rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
    >
      {content}
    </Link>
  )
}

// Renders a vertical connector with the trigger badge in the middle.
const VerticalConnector = ({ trigger }) => (
  <div className='flex flex-col items-center'>
    <div className='h-3 w-px bg-line' />
    {trigger && <TriggerBadge trigger={trigger} />}
    <div className='h-3 w-px bg-line' />
  </div>
)

// Renders the children of a node with the appropriate connectors.
const ChildrenList = ({ nodes, currentName, search, typeColor }) => {
  if (nodes.length === 1) {
    return (
      <div className='flex flex-col items-center'>
        <VerticalConnector trigger={nodes[0].trigger} />
        <EvolutionSubtree
          node={nodes[0]}
          currentName={currentName}
          search={search}
          typeColor={typeColor}
        />
      </div>
    )
  }

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='h-4 w-px bg-line' />
      <div className='relative flex w-full flex-col gap-4 pl-10'>
        {/* Shared vertical rail for all branches. */}
        <div className='absolute left-2 top-0 bottom-0 w-px bg-line' />
        {nodes.map((node) => (
          <div key={node.name} className='relative flex flex-col'>
            {/* Branch row: horizontal connector from the rail to the child node. */}
            <div className='relative flex items-center gap-2'>
              <div className='absolute -left-8 top-1/2 h-px w-8 bg-line' />
              {node.trigger && <TriggerBadge trigger={node.trigger} />}
              <EvolutionNode
                node={node}
                currentName={currentName}
                search={search}
                typeColor={typeColor}
              />
            </div>
            {/* The child's own descendants continue below with a short stem. */}
            {node.children.length > 0 && (
              <div className='flex flex-col items-center pt-2'>
                <div className='h-4 w-px bg-line' />
                <ChildrenList
                  nodes={node.children}
                  currentName={currentName}
                  search={search}
                  typeColor={typeColor}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Renders a node and everything below it.
const EvolutionSubtree = ({ node, currentName, search, typeColor }) => (
  <div className='flex flex-col items-center'>
    <EvolutionNode node={node} currentName={currentName} search={search} typeColor={typeColor} />
    {node.children.length > 0 && (
      <ChildrenList
        nodes={node.children}
        currentName={currentName}
        search={search}
        typeColor={typeColor}
      />
    )}
  </div>
)

export const EvolutionTree = ({ tree, currentName, search, typeColor }) => {
  if (!tree) return null
  if (tree.children.length === 0) {
    return <p className='text-sm text-muted'>This Pokémon does not evolve.</p>
  }

  return (
    <EvolutionSubtree node={tree} currentName={currentName} search={search} typeColor={typeColor} />
  )
}
