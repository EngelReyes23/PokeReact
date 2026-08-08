import { IconType } from './IconType'

export const Badge = ({ type, color, letter }) => (
  <div
    style={{
      color,
      backgroundColor: `${color}50`
    }}
    className='flex items-center gap-1 rounded-full border-current px-3 py-0.5 text-base font-semibold group-hover:border'
  >
    <IconType letter={letter} />
    <span>{type}</span>
  </div>
)
