export const Badge = ({ type, icon, color }) => (
  <div
    style={{
      color,
      backgroundColor: `${color}50`
    }}
    className='flex max-w-full items-center gap-1 rounded-full px-3'
  >
    <div style={{ color }} className='text-md'>
      {icon}
    </div>
    <span className='text-sm font-semibold'>{type}</span>
  </div>
)
