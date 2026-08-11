const ENGLISH_LANGUAGE = 'en'
const CATCH_RATE_MAX = 255

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

export const humanizeIdentifier = (value) => {
  if (!isNonEmptyString(value)) return ''

  return String(value)
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => {
      if (word.length === 0) return word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

const collapseWhitespace = (text) =>
  text
    .replace(/\f/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const getEnglishFlavorText = (species = {}) => {
  const entries = species?.flavor_text_entries
  if (!Array.isArray(entries)) return 'No Pokédex entry available.'

  const entry = entries.find((item) => item?.language?.name === ENGLISH_LANGUAGE)

  if (!entry || !isNonEmptyString(entry.flavor_text)) {
    return 'No Pokédex entry available.'
  }

  return collapseWhitespace(entry.flavor_text)
}

export const getPokemonCategory = (species = {}) => {
  const genera = species?.genera
  if (!Array.isArray(genera)) return 'Unknown'

  const entry = genera.find((item) => item?.language?.name === ENGLISH_LANGUAGE)

  if (!entry || !isNonEmptyString(entry.genus)) return 'Unknown'

  return entry.genus.trim()
}

const EGG_GROUP_OVERRIDES = {
  humanshape: 'Human-Like'
}

export const formatEggGroup = (eggGroup) => {
  const rawName = typeof eggGroup === 'string' ? eggGroup : eggGroup?.name
  if (!isNonEmptyString(rawName)) return ''

  const normalized = rawName.trim().toLowerCase()

  if (EGG_GROUP_OVERRIDES[normalized]) {
    return EGG_GROUP_OVERRIDES[normalized]
  }

  const withSpaces = normalized.replace(/(\D)(\d)/g, '$1 $2')
  return humanizeIdentifier(withSpaces)
}

export const formatEggGroups = (eggGroups = []) => {
  if (!Array.isArray(eggGroups)) return []

  return eggGroups.map(formatEggGroup).filter(Boolean)
}

export const splitAbilities = (abilities = []) => {
  if (!Array.isArray(abilities)) {
    return { regular: [], hidden: [] }
  }

  const regular = []
  const hidden = []

  for (const ability of abilities) {
    const name = ability?.ability?.name
    const label = humanizeIdentifier(name)
    if (!label) continue

    if (ability?.is_hidden === true) {
      hidden.push(label)
    } else {
      regular.push(label)
    }
  }

  return { regular, hidden }
}

export const formatCatchRate = (captureRate) => {
  if (captureRate == null || Number.isNaN(captureRate) || typeof captureRate !== 'number') {
    return {
      valid: false,
      raw: null,
      max: CATCH_RATE_MAX,
      percentage: null,
      display: '—'
    }
  }

  const raw = Math.trunc(captureRate)

  if (raw < 0 || raw > CATCH_RATE_MAX) {
    return {
      valid: false,
      raw,
      max: CATCH_RATE_MAX,
      percentage: null,
      display: `${raw} / ${CATCH_RATE_MAX}`
    }
  }

  const percentage = Number(((raw / CATCH_RATE_MAX) * 100).toFixed(1))

  return {
    valid: true,
    raw,
    max: CATCH_RATE_MAX,
    percentage,
    display: `${raw} / ${CATCH_RATE_MAX} · ${percentage}%`
  }
}
