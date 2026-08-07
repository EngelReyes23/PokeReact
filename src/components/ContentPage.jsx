import { usePagination } from '../Hooks/usePagination'
import { PaginationComponent } from './PaginationComponent'
import { PokemonList } from './PokemonList'

export const ContentPage = ({ workingList }) => {
  const pagination = usePagination(workingList)

  return (
    <>
      <PaginationComponent {...pagination} />
      <PokemonList pokemonDataList={pagination.pageItems} />
      <PaginationComponent {...pagination} />
    </>
  )
}
