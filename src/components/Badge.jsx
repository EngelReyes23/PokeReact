import { IconType } from './IconType'

// Tint background (15%) + darker type-700 text so every type passes WCAG AA on
// light surfaces. CSS custom props let Tailwind pick the dark variant (base
// color on a stronger tint) automatically when the `.dark` class is present.
export const Badge = ({ type, color, letter, dark: darkColor }) => (
  <div
    className='flex items-center gap-1 whitespace-nowrap rounded-full bg-[var(--type-bg)] px-3 py-0.5 text-sm font-semibold text-[var(--type-text)] dark:bg-[var(--type-bg-dark)] dark:text-[var(--type-text-dark)]'
    style={{
      '--type-bg': `${color}26`,
      '--type-bg-dark': `${color}59`,
      '--type-text': darkColor,
      '--type-text-dark': color
    }}
  >
    <IconType letter={letter} />
    <span>{type}</span>
  </div>
)
