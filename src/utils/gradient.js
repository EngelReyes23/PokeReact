import { TYPES } from '../constants/types'

export const typeGradient = (pokemonTypes, alpha) => {
  let background = ''

  if (pokemonTypes.length > 1) {
    background = `linear-gradient(0deg, ${pokemonTypes
      .map((type) => TYPES[type].color + alpha)
      .join(', ')})`
  } else background = TYPES[pokemonTypes[0]].color + alpha

  return {
    background
  }
}

// Par de colores del pokemon: [primario, secundario] (monotipo repite el primario).
const typeColors = (pokemonTypes) => [
  TYPES[pokemonTypes[0]].color,
  TYPES[pokemonTypes[1] ?? pokemonTypes[0]].color
]

// Mezcla RGB al 50% de ambos tipos: un solo color tematico, sin direccion.
const mixColors = (colorA, colorB) => {
  const a = parseInt(colorA.slice(1), 16)
  const b = parseInt(colorB.slice(1), 16)
  const r = Math.round(((a >> 16) + (b >> 16)) / 2)
  const g = Math.round((((a >> 8) & 255) + ((b >> 8) & 255)) / 2)
  const bl = Math.round(((a & 255) + (b & 255)) / 2)
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`
}

// Focos compartidos detras del artwork. Son CSS vars con fallback desktop; el
// wrapper del detalle las sobrescribe en movil (artwork apilado centrado).
// El acento solo se desplaza en vertical, nunca hacia un lado.
const HALO_FOCAL = 'var(--detail-focal, 36% 50%)'
const ACCENT_FOCAL = 'var(--detail-focal-accent, 36% 44%)'

const radialField = (color, alpha, size, focal) =>
  `radial-gradient(${size} at ${focal}, ${color + alpha} 0%, transparent 72%)`

// Jerarquia semantica de superficies del detalle.
// Estrategia: base plana del color MEZCLADO en toda la superficie (sin foco ni
// direccion) + halos LOCALES de ambos tipos alrededor del artwork. Los radios
// locales terminan antes de los bordes: el resultado no depende del clipping
// del contenedor y ningun lado queda asignado a un tipo.
export const typeTheme = {
  // Ambiente de pagina: base mezclada + un unico campo amplio del color mezclado.
  pageBackground: (pokemonTypes) => {
    const [primary, secondary] = typeColors(pokemonTypes)
    const mixed = mixColors(primary, secondary)
    return {
      background: [radialField(mixed, '1f', '130% 85%', '50% 28%'), `${mixed}14`].join(', ')
    }
  },

  // Hero: base mezclada uniforme + halo primario y acento secundario locales
  // y solapados alrededor del artwork.
  heroSurface: (pokemonTypes) => {
    const [primary, secondary] = typeColors(pokemonTypes)
    const mixed = mixColors(primary, secondary)
    return {
      background: [
        radialField(primary, '40', '30% 55%', HALO_FOCAL),
        radialField(secondary, '40', '24% 45%', ACCENT_FOCAL),
        `${mixed}2e`
      ].join(', ')
    }
  },

  // Tinte plano mezclado (sin gradiente): mismo tratamiento en todas las cards.
  contentSurface: (pokemonTypes) => {
    const [primary, secondary] = typeColors(pokemonTypes)
    return { background: mixColors(primary, secondary) + '24' }
  },

  // Eco tenue del color mezclado, solo en PokemonDetail.
  footerSurface: (pokemonTypes) => {
    const [primary, secondary] = typeColors(pokemonTypes)
    const mixed = mixColors(primary, secondary)
    return {
      background: [radialField(mixed, '17', '150% 250%', '50% 0%'), `${mixed}0a`].join(', ')
    }
  },

  // Halo del primario directamente detras del artwork (foco principal).
  artworkHalo: (pokemonTypes) => {
    const [primary] = typeColors(pokemonTypes)
    return {
      background: `radial-gradient(circle, ${primary}8c 0%, ${primary}4d 45%, transparent 70%)`
    }
  }
}
