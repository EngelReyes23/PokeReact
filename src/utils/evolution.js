const officialArtwork = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

const spriteFromId = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

export const imageFrom = (sprites) => {
  if (!sprites) return spriteFromId('0')
  return (
    sprites.other?.['official-artwork']?.front_default ||
    sprites.other?.home?.front_default ||
    sprites.front_shiny ||
    sprites.front_default ||
    spriteFromId('0')
  )
}

const idFromUrl = (url) => {
  const parts = String(url).split('/').filter(Boolean)
  return parts[parts.length - 1]
}
const humanize = (str) => {
  if (str == null) return ''
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const formatTimeOfDay = (time) => {
  const map = { day: 'day', night: 'night', dusk: 'dusk' }
  return map[time] || time
}

// Formats the primary evolution trigger into a short English string.
// Priority for combined conditions: specific condition (level/move/happiness/location)
// > held_item > time_of_day. Time of day is appended in parentheses when not the
// main condition. When held_item is the primary condition with no level, the item
// leads the phrase ("With {item} at night") for natural reading.
export const describeTrigger = (details = {}) => {
  const trigger = details.trigger?.name
  if (!trigger) return null

  const timeParen = details.time_of_day ? ` (${formatTimeOfDay(details.time_of_day)})` : ''
  const timeWord = details.time_of_day ? formatTimeOfDay(details.time_of_day) : null
  const heldItem = details.held_item?.name ? humanize(details.held_item.name) : null

  switch (trigger) {
    case 'level-up': {
      let base = null
      if (details.min_level) base = `Level ${details.min_level}`
      else if (details.known_move?.name) base = `Learn ${humanize(details.known_move.name)}`
      else if (details.known_move_type?.name) { base = `Learn a ${humanize(details.known_move_type.name)}-type move` } else if (details.min_happiness) base = 'High friendship'
      else if (details.location?.name) base = `At ${humanize(details.location.name)}`

      if (heldItem) {
        if (base) return `${base} holding ${heldItem}${timeParen}`
        if (timeWord) return `With ${heldItem} at ${timeWord}`
        return `With ${heldItem}`
      }

      return (base || 'Level up') + timeParen
    }
    case 'trade': {
      const item = details.item?.name ? humanize(details.item.name) : heldItem
      if (item) return `Trade holding ${item}${timeParen}`
      return `Trade${timeParen}`
    }
    case 'use-item': {
      if (details.item?.name) return `Using ${humanize(details.item.name)}${timeParen}`
      return humanize(trigger) + timeParen
    }
    case 'shed':
      return 'Shed'
    case 'three-critical-hits':
      return '3 critical hits'
    case 'agile-style-move':
      return 'Agile style move'
    default:
      return humanize(trigger) + timeParen
  }
}
// Public alias for callers that need a clear, intention-revealing name.
export const formatEvolutionTrigger = describeTrigger

// Aplana la cadena evolutiva recursiva en una lista ordenada.
// Cada evolución se acompaña de la condición (trigger) que la permite.
export const flattenChain = (chain, cache = {}) => {
  const list = []

  const walk = (node, condition) => {
    const id = idFromUrl(node.species?.url)
    const name = node.species?.name
    const cached = cache?.[name]?.pokemon
    const sprite = cached ? imageFrom(cached.sprites) : officialArtwork(id)
    list.push({ name, id, sprite, condition })

    node.evolves_to.forEach((child) => {
      walk(child, describeTrigger(child.evolution_details[0]))
    })
  }

  if (chain) walk(chain, null)
  return list
}

export const extractChainId = (url) => idFromUrl(url)

// Builds a normalized recursive tree from a PokeAPI evolution-chain root node.
// Each node carries its own trigger (null for the base stage) and its children.
export const buildEvolutionTree = (chain, cache = {}) => {
  const walk = (node) => {
    const id = Number(idFromUrl(node.species?.url))
    const name = node.species?.name
    const cached = cache?.[name]?.pokemon
    const spriteUrl = cached ? imageFrom(cached.sprites) : officialArtwork(id)
    const trigger = describeTrigger(node.evolution_details?.[0])
    const children = node.evolves_to?.map(walk) || []

    return { name, id, spriteUrl, trigger, children }
  }

  return chain ? walk(chain) : null
}
