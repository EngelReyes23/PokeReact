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

const formatTimeOfDay = (time) => {
  const map = { day: 'día', night: 'noche', dusk: 'atardecer' }
  return map[time] || time
}

// Formats the primary evolution trigger into a short Spanish string.
// Priority for combined conditions: specific condition (level/move/happiness/location)
// > held_item > time_of_day. Time of day is always appended in parentheses when present.
// For level-ups where held_item is the main condition and no level is set, the item leads
// the phrase ("Con {item} de noche") to keep it natural.
export const describeTrigger = (details = {}) => {
  const trigger = details.trigger?.name
  if (!trigger) return null

  const time = details.time_of_day ? ` (${formatTimeOfDay(details.time_of_day)})` : ''
  const heldItem = details.held_item?.name

  switch (trigger) {
    case 'level-up': {
      let base = null
      if (details.min_level) base = `Nivel ${details.min_level}`
      else if (details.known_move?.name) base = `Aprender ${details.known_move.name}`
      else if (details.known_move_type?.name) { base = `Aprender ataque ${details.known_move_type.name}` } else if (details.min_happiness) base = 'Alta amistad'
      else if (details.location?.name) base = `En ${details.location.name}`

      if (heldItem) {
        if (base) return `${base} con ${heldItem}${time}`
        return `Con ${heldItem}${time}`
      }

      return (base || 'Subida de nivel') + time
    }
    case 'trade': {
      const item = details.item?.name || heldItem
      if (item) return `Intercambiando con ${item}${time}`
      return `Intercambio${time}`
    }
    case 'use-item': {
      if (details.item?.name) return `Usando ${details.item.name}${time}`
      return trigger.replace(/-/g, ' ') + time
    }
    case 'shed':
      return 'Caparazón'
    case 'three-critical-hits':
      return '3 golpes críticos'
    case 'agile-style-move':
      return 'Movimiento estilo ágil'
    default:
      return trigger.replace(/-/g, ' ') + time
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
