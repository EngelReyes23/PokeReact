import { NextButton, PageButton, Pagination, PrevButton } from 'react-headless-pagination'

// Local imports
import { IconNextArrow, IconPrevArrow } from '../icons'

export const PaginationComponent = ({ page, handlePageChange, prevPage, nextPage, totalPages }) => {
  return (
    <>
      <Pagination
        className='mx-auto flex h-10 w-full max-w-screen-2xl select-none items-center justify-center py-10 px-5 text-sm'
        currentPage={page}
        edgePageCount={3}
        middlePagesSiblingCount={2}
        setCurrentPage={handlePageChange}
        totalPages={totalPages}
        truncableClassName='w-10 px-0.5 text-center text-black dark:text-white transition-colors'
      >
        {prevPage && (
          <PrevButton className='mr-2 flex cursor-pointer items-center rounded-lg bg-gray-200 px-3 py-2 text-gray-500 transition-colors hover:bg-purple-500 hover:text-white  focus:outline-none dark:bg-gray-600 dark:text-gray-100  dark:hover:bg-purple-600 dark:hover:text-gray-200'>
            <IconPrevArrow className='mr-3' />
            Previous
          </PrevButton>
        )}

        <div className='hidden flex-grow items-center justify-center gap-1 sm:flex'>
          <PageButton
            activeClassName='bg-purple-500 text-white transition-colors dark:bg-purple-600'
            className='flex  h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-purple-400 hover:text-white dark:bg-gray-600 dark:text-gray-100  dark:hover:bg-purple-600'
            inactiveClassName='text-gray-500'
          />
        </div>

        {nextPage && (
          <NextButton className='mr-2 flex cursor-pointer items-center rounded-lg bg-gray-200 px-3 py-2 text-gray-500 transition-colors hover:bg-purple-500 hover:text-white focus:outline-none dark:bg-gray-600 dark:text-gray-100  dark:hover:bg-purple-600 dark:hover:text-gray-200'>
            Next
            <IconNextArrow className='ml-3' />
          </NextButton>
        )}
      </Pagination>
    </>
  )
}
