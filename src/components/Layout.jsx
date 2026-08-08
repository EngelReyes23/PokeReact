import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export const Layout = () => (
  <main className='flex min-h-screen flex-col bg-bg transition-colors duration-500 dark:bg-gray-900'>
    <Header />
    <div className='flex-1'>
      <Outlet />
    </div>
    <Footer />
  </main>
)
