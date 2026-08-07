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

export const describeTrigger = (details = {}) => {
  const trigger = details.trigger?.name
  if (!trigger) return null
  switch (trigger) {
    case 'level-up': {
      if (details.min_level) return `Nivel ${details.min_level}`
      if (details.known_move) return `Aprender ${details.known_move.name}`
      if (details.min_happiness) return 'Alta amistad'
      if (details.location) return `En ${details.location.name}`
      return 'Subida de nivel'
    }
    case 'trade': {
      if (details.item) return `Intercambiando con ${details.item.name}`
      return 'Intercambio'
    }
    case 'use-item':
      return `Usando ${details.item?.name}`
    case 'shed':
      return 'Caparazón'
    case 'three-critical-hits':
      return '3 golpes críticos'
    case 'agile-style-move':
      return 'Movimiento estilo ágil'
    default:
      return trigger.replace(/-/g, ' ')
  }
}

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
