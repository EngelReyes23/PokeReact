import { Badge } from './Badge'
import { IconType } from './IconType'

const imageNotFound =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'

const typesColors = {
  bug: { color: '#94BC4A', icon: <IconType letter='b' /> },
  ice: { color: '#70CBD4', icon: <IconType letter='i' /> },
  dark: { color: '#736C75', icon: <IconType letter='d' /> },
  fire: { color: '#EA7A3C', icon: <IconType letter='r' /> },
  rock: { color: '#B2A061', icon: <IconType letter='k' /> },
  water: { color: '#539AE2', icon: <IconType letter='w' /> },
  fairy: { color: '#E397D1', icon: <IconType letter='y' /> },
  ghost: { color: '#846AB6', icon: <IconType letter='h' /> },
  grass: { color: '#71C558', icon: <IconType letter='g' /> },
  steel: { color: '#89A1B0', icon: <IconType letter='m' /> },
  dragon: { color: '#6A7BAF', icon: <IconType letter='n' /> },
  flying: { color: '#7DA6DE', icon: <IconType letter='v' /> },
  ground: { color: '#CC9F4F', icon: <IconType letter='a' /> },
  normal: { color: '#AAB09F', icon: <IconType letter='c' /> },
  poison: { color: '#B468B7', icon: <IconType letter='o' /> },
  psychic: { color: '#E5709B', icon: <IconType letter='p' /> },
  fighting: { color: '#CB5F48', icon: <IconType letter='f' /> },
  electric: { color: '#E5C531', icon: <IconType letter='l' /> }
}

const styles = (pokemonTypes, percentage) => {
  let background = ''

  if (pokemonTypes.length > 1) {
    background = `linear-gradient(0deg, ${pokemonTypes
      .map((type) => typesColors[type].color + percentage)
      .join(', ')})`
  } else background = typesColors[pokemonTypes[0]].color + percentage

  return {
    background,
    color: typesColors[pokemonTypes[0]].color
  }
}

// #region Component
export const PokemonCard = ({ pokemon }) => {
  const { name, types, sprites } = pokemon
  const pokemonTypes = types.map((type) => type.type.name)

  return (
    <div
      style={styles(pokemonTypes, 50)}
      className='animate__animated animate__fadeIn shadow-current/50 group flex max-h-full min-h-[250px] w-[250px] transform cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-xl border-current py-2.5 transition-transform hover:scale-110 hover:border'
    >
      <div
        className='min-h-[150px] w-1/2 min-w-[150px] rounded-full border-current transition group-hover:border'
        style={styles(pokemonTypes, 50)}
      >
        <img
          alt={name}
          className='w-full scale-110 object-cover'
          src={
            sprites.other['official-artwork'].front_default ||
            sprites.other.home.front_default ||
            sprites.front_shiny ||
            sprites.front_default ||
            imageNotFound
          }
        />
      </div>

      <p className='-mt-1 text-center text-2xl font-semibold capitalize transition group-hover:font-bold'>
        {name}
      </p>

      <div className='flex items-center justify-center gap-2'>
        {pokemonTypes.map((type) => (
          <Badge key={type} type={type} {...typesColors[type]} />
        ))}
      </div>
    </div>
  )
}
// #endregion Component
