export const Badge = ({ type, icon, color }) => (
  <div
    style={{
      color,
      backgroundColor: `${color}50`
    }}
    className='text-md flex items-center gap-1 rounded-full px-3 py-0.5 font-semibold'
  >
    <div>{icon}</div>
    <span>{type}</span>
  </div>
)
