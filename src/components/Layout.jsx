import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export const Layout = () => (
  <main className='min-h-screen bg-gray-100 transition-colors duration-500 dark:bg-gray-900'>
    <Header />
    <Outlet />
    <Footer />
  </main>
)
