import React from 'react'
import { Toggle } from './Toggle'

export const Header = () => (
  <header className='sticky top-0 z-20 mb-5 w-full select-none rounded border-gray-200 bg-white px-2 py-2.5 shadow-sm transition duration-700 dark:bg-gray-700 sm:px-4'>
    <div className='container mx-auto flex items-center justify-between gap-4'>
      <h1 className='text-4xl font-bold text-purple-600'>Pokedux</h1>
      <Toggle />
    </div>
  </header>
)
