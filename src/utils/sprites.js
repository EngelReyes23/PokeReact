const getNormal = (sprites, fallback) =>
  sprites.other?.['official-artwork']?.front_default ||
  sprites.other?.home?.front_default ||
  sprites.front_default ||
  fallback

export const resolvePokemonSprite = (sprites, appearance = 'normal', fallback) => {
  if (!sprites) return fallback

  if (appearance === 'shiny') {
    const shiny =
      sprites.other?.['official-artwork']?.front_shiny ||
      sprites.other?.home?.front_shiny ||
      sprites.front_shiny
    if (shiny) return shiny
    return getNormal(sprites, fallback)
  }

  return getNormal(sprites, fallback)
}

export const hasShinySprite = (sprites) => {
  if (!sprites) return false
  return Boolean(
    sprites.other?.['official-artwork']?.front_shiny ||
      sprites.other?.home?.front_shiny ||
      sprites.front_shiny
  )
}
