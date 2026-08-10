import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DetailThemeContext } from '../contexts/detailTheme'
import { Footer } from './Footer'
import { Header } from './Header'

export const Layout = () => {
  const [detailTheme, setDetailTheme] = useState(null)

  return (
    <DetailThemeContext.Provider value={setDetailTheme}>
      <main className='flex min-h-screen flex-col bg-bg transition-colors duration-500 dark:bg-gray-900'>
        <Header />
        <div className='flex flex-1 flex-col'>
          <Outlet />
        </div>
        <Footer surfaceStyle={detailTheme?.footer ?? null} />
      </main>
    </DetailThemeContext.Provider>
  )
}
