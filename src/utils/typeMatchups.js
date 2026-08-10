import { TYPES } from '../constants/types.js'

const DEFENSIVE_MULTIPLIERS = {
  double_damage_from: 2,
  half_damage_from: 0.5,
  no_damage_from: 0
}

const DEFENSIVE_RELATION_KEYS = Object.keys(DEFENSIVE_MULTIPLIERS)

const normalizeAttackingType = (entry) => {
  if (entry == null) return ''
  if (typeof entry === 'string') return entry
  return entry.name || ''
}

const createNeutralMultiplierMap = () => {
  const map = {}
  for (const type of Object.keys(TYPES)) {
    map[type] = 1
  }
  return map
}

const classifyMatchupGroups = (multipliers) => {
  const groups = {
    fourTimesWeaknesses: [],
    twoTimesWeaknesses: [],
    neutral: [],
    halfResistances: [],
    quarterResistances: [],
    immunities: []
  }

  for (const type of Object.keys(TYPES)) {
    const value = multipliers[type]

    if (value === 4) groups.fourTimesWeaknesses.push(type)
    else if (value === 2) groups.twoTimesWeaknesses.push(type)
    else if (value === 1) groups.neutral.push(type)
    else if (value === 0.5) groups.halfResistances.push(type)
    else if (value === 0.25) groups.quarterResistances.push(type)
    else if (value === 0) groups.immunities.push(type)
  }

  return groups
}

/**
 * Calculates defensive type matchups from a set of defensive Pokémon types and
 * their available PokeAPI damage_relations.
 *
 * Only defensive relations are read:
 *   - double_damage_from
 *   - half_damage_from
 *   - no_damage_from
 *
 * Offensive relations are ignored.
 *
 * The function returns a result object that distinguishes between complete and
 * incomplete input. When a required defensive type relation is missing, no
 * displayable matchup groups are produced.
 *
 * @param {Object} params
 * @param {string[]} params.defensiveTypes - Normalized defensive type names.
 * @param {Object.<string, Object>} params.relationsByType - Available damage_relations keyed by defensive type name.
 *
 * @returns {{
 *   complete: boolean,
 *   missingDefensiveTypes: string[],
 *   invalidInput: boolean,
 *   matchups: { multipliers: Object.<string, number>, groups: Object } | null
 * }}
 */
export const calculateTypeMatchups = ({ defensiveTypes, relationsByType }) => {
  if (!Array.isArray(defensiveTypes)) {
    return {
      complete: false,
      missingDefensiveTypes: [],
      invalidInput: true,
      matchups: null
    }
  }

  const normalizedDefensiveTypes = defensiveTypes
    .map((type) => (typeof type === 'string' ? type.trim().toLowerCase() : ''))
    .filter(Boolean)

  const missingDefensiveTypes = normalizedDefensiveTypes.filter(
    (type) => relationsByType == null || relationsByType[type] == null
  )

  if (missingDefensiveTypes.length > 0) {
    return {
      complete: false,
      missingDefensiveTypes,
      invalidInput: false,
      matchups: null
    }
  }

  const multipliers = createNeutralMultiplierMap()

  for (const defensiveType of normalizedDefensiveTypes) {
    const relations = relationsByType[defensiveType]

    for (const relationKey of DEFENSIVE_RELATION_KEYS) {
      const entries = relations[relationKey]
      if (!Array.isArray(entries)) continue

      for (const entry of entries) {
        const attackingType = normalizeAttackingType(entry)
        if (attackingType in multipliers) {
          multipliers[attackingType] *= DEFENSIVE_MULTIPLIERS[relationKey]
        }
      }
    }
  }

  return {
    complete: true,
    missingDefensiveTypes: [],
    invalidInput: false,
    matchups: {
      multipliers,
      groups: classifyMatchupGroups(multipliers)
    }
  }
}
