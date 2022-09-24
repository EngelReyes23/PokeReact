import React from 'react'
import { Toggle } from './Toggle'

export const Header = () => (
  <header className='sticky top-0 z-20 w-full select-none bg-gray-200/95 px-3 py-3 transition-colors duration-700 dark:bg-gray-800/95 sm:px-4'>
    <div className='container mx-auto flex h-full items-center justify-between gap-4'>
      <h1 className='text-4xl font-bold text-purple-600'>Pokedux</h1>
      <Toggle />
    </div>
  </header>
)
