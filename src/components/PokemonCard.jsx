import { Badge } from './Badge'
import { IconType } from './IconType'

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

export const PokemonCard = ({ pokemon }) => {
  const { name, types, sprites } = pokemon
  const pokemonTypes = types.map((type) => type.type.name)

  const styles = (percentage) => {
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

  return (
    <div
      style={styles(50)}
      className='shadow-current/50 flex h-[250px] w-[250px] transform cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-xl transition-transform hover:scale-110'
    >
      <div className='min-h-[150px] w-1/2 min-w-[150px] rounded-full' style={styles(50)}>
        <img
          alt={name}
          className='w-full scale-110 object-cover'
          src={
            sprites.other['official-artwork'].front_default ||
            sprites.other.home.front_default ||
            sprites.front_shiny ||
            sprites.front_default ||
            ''
          }
        />
      </div>

      <h3 className='-mt-1 text-center text-2xl font-bold capitalize'>{name}</h3>

      <div className='flex items-center justify-center gap-2'>
        {pokemonTypes.map((type) => (
          <Badge key={type} type={type} {...typesColors[type]} />
        ))}
      </div>
    </div>
  )
}
