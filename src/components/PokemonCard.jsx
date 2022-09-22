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

  return (
    <div
      style={{
        // si tiene mas de un tipo usa gradient, si solo tiene uno usa el color
        background:
          pokemonTypes.length > 1
            ? `linear-gradient(0deg, ${pokemonTypes
                .map((type) => typesColors[type].color + 50)
                .join(', ')})`
            : typesColors[pokemonTypes[0]].color + 50
      }}
      className='flex max-w-xs transform cursor-pointer flex-col items-center rounded-lg shadow transition-transform hover:scale-105'
    >
      <div className='w-1/2'>
        <img
          alt={name}
          className='w-full rounded-t-lg object-cover'
          src={sprites.other['official-artwork'].front_default}
        />
      </div>

      <h3 className='text-center text-xl font-semibold capitalize text-gray-900'>{name}</h3>

      <div className='flex items-center justify-evenly gap-2 p-5'>
        {pokemonTypes.map((type) => (
          <Badge key={type} type={type} {...typesColors[type]} />
        ))}
      </div>
    </div>
  )
}
