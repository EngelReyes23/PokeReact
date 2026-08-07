import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { IconType } from '../components/IconType'
import { Spinner } from '../components/Spinner'
import { api } from '../utils/api'

const imageNotFound =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'

const typesColors = {
  bug: { color: '#94BC4A' },
  ice: { color: '#70CBD4' },
  dark: { color: '#736C75' },
  fire: { color: '#EA7A3C' },
  rock: { color: '#B2A061' },
  water: { color: '#539AE2' },
  fairy: { color: '#E397D1' },
  ghost: { color: '#846AB6' },
  grass: { color: '#71C558' },
  steel: { color: '#89A1B0' },
  dragon: { color: '#6A7BAF' },
  flying: { color: '#7DA6DE' },
  ground: { color: '#CC9F4F' },
  normal: { color: '#AAB09F' },
  poison: { color: '#B468B7' },
  psychic: { color: '#E5709B' },
  fighting: { color: '#CB5F48' },
  electric: { color: '#E5C531' }
}

export const PokemonDetail = () => {
  const { name } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    api
      .pokemon(name)
      .then((data) => {
        if (active) setPokemon(data)
      })
      .catch((err) => {
        if (active) setError(err)
      })

    return () => {
      active = false
    }
  }, [name])

  if (error) {
    return (
      <section className='container mx-auto flex flex-col items-center gap-4 px-4 py-10'>
        <p className='text-xl'>No pudimos cargar este pokémon.</p>
        <Link
          to='/'
          className='rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-600 transition-colors hover:bg-purple-500 hover:text-white dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-purple-600'
        >
          ← Volver
        </Link>
      </section>
    )
  }

  if (!pokemon) {
    return <Spinner />
  }

  const { types, sprites, stats } = pokemon
  const image =
    sprites?.other?.['official-artwork']?.front_default ||
    sprites?.other?.home?.front_default ||
    sprites?.front_shiny ||
    sprites?.front_default ||
    imageNotFound

  return (
    <section className='container mx-auto flex flex-col items-center gap-6 px-4 py-10'>
      <Link
        to='/'
        className='self-start rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-600 transition-colors hover:bg-purple-500 hover:text-white dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-purple-600'
      >
        ← Volver
      </Link>

      <span
        className='rounded-full'
        style={{ backgroundColor: `${typesColors[types[0].type.name]}50` }}
      >
        <img src={image} alt={name} className='h-56 w-56 object-cover' />
      </span>

      <h2 className='text-4xl font-bold capitalize'>{name}</h2>

      <div className='flex items-center justify-center gap-2'>
        {types.map((type) => {
          const t = type.type.name
          return (
            <Badge
              key={t}
              type={t}
              icon={<IconType letter={t[0]} />}
              color={typesColors[t]?.color}
            />
          )
        })}
      </div>

      {stats && (
        <div className='w-full max-w-xl'>
          <h3 className='mb-3 text-xl font-semibold'>Stats</h3>
          <div className='overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800'>
            {stats.map((stat) => (
              <div
                key={stat.stat.name}
                className='flex items-center justify-between gap-2 border-b px-4 py-2 text-sm last:border-0 dark:border-gray-700'
              >
                <span className='capitalize'>{stat.stat.name}</span>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600'>
                    <div
                      className='h-full rounded-full bg-purple-500'
                      style={{ width: `${Math.min(100, stat.base_stat)}%` }}
                    />
                  </div>
                  <span className='w-10 text-right font-semibold'>{stat.base_stat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
