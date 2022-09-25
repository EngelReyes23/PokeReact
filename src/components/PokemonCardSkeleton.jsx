export const PokemonCardSkeleton = () => (
  <div className='animate__animated animate__fadeIn shadow-current/50 flex max-h-full min-h-[250px] w-[250px] transform cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-xl bg-gray-300 py-3 transition-transform hover:scale-110 dark:bg-gray-700'>
    <div className='animate min-h-[150px] w-1/2 min-w-[150px] animate-pulse rounded-full bg-gray-400 dark:bg-gray-600'>
      <img className='w-full scale-110 object-cover' />
    </div>

    <h3 className='animate mt-3 h-8 w-1/2 animate-pulse bg-gray-400 text-center text-2xl font-bold capitalize dark:bg-gray-600' />

    <div className='flex items-center justify-center gap-2' />
  </div>
)
