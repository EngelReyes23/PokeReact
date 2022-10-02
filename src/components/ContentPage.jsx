import { usePagination } from '../Hooks/usePagination'
import { PaginationComponent } from './PaginationComponent'

export const ContentPage = ({ children }) => {
  const props = usePagination()

  return (
    <>
      <PaginationComponent {...props} />
      {children}
      <PaginationComponent {...props} />
    </>
  )
}
