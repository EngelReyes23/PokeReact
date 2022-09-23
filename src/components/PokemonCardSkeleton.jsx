export const PokemonCardSkeleton = () => (
  <div className='animate__animated animate__fadeIn shadow-current/50 flex h-[250px] w-[250px] transform cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-xl bg-red-500 transition-transform hover:scale-110'>
    <div className='animate min-h-[150px] w-1/2 min-w-[150px] animate-pulse rounded-full bg-gray-300' />

    <h3 className='animate -mt-1 h-5 w-1/2 animate-pulse bg-gray-300 text-center text-2xl font-bold capitalize' />

    <div className='animate flex animate-pulse items-center justify-center gap-2'>
      <div className='animate h-6 w-10 animate-pulse bg-gray-200' />
      <div className='animate h-6 w-10 animate-pulse bg-gray-200' />
    </div>
  </div>
)
