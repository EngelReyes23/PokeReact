// Centralised single source of truth for Pokémon type colours and the letter
// glyph used by the Essentiarum icon font. Base colours are unchanged from the
// original per-type values; only the definition location moves here.

const TYPE_BASE = {
  bug: '#94BC4A',
  ice: '#70CBD4',
  dark: '#736C75',
  fire: '#EA7A3C',
  rock: '#B2A061',
  water: '#539AE2',
  fairy: '#E397D1',
  ghost: '#846AB6',
  grass: '#71C558',
  steel: '#89A1B0',
  dragon: '#6A7BAF',
  flying: '#7DA6DE',
  ground: '#CC9F4F',
  normal: '#AAB09F',
  poison: '#B468B7',
  psychic: '#E5709B',
  fighting: '#CB5F48',
  electric: '#E5C531'
}

const ICON_LETTERS = {
  bug: 'b',
  ice: 'i',
  dark: 'd',
  fire: 'r',
  rock: 'k',
  water: 'w',
  fairy: 'y',
  ghost: 'h',
  grass: 'g',
  steel: 'm',
  dragon: 'n',
  flying: 'v',
  ground: 'a',
  normal: 'c',
  poison: 'o',
  psychic: 'p',
  fighting: 'f',
  electric: 'l'
}

// Darker variant used for legible text on top of the tinted type background
const darken = (hex, factor) => {
  const channels = [0, 2, 4].map((i) => {
    const value = parseInt(hex.slice(i + 1, i + 3), 16)
    return Math.round(value * factor)
  })
  return `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

export const TYPES = Object.fromEntries(
  Object.entries(TYPE_BASE).map(([type, color]) => [
    type,
    { color, letter: ICON_LETTERS[type], dark: darken(color, 0.45) }
  ])
)
