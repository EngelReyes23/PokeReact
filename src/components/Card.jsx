import { forwardRef } from 'react'

// Base surface of the design system: radius lg (16px), elevation md, never
// combined with a border. `as` lets links/buttons reuse the same card shell.
export const Card = forwardRef(function Card (
  { as: Tag = 'div', className = '', style, children, ...rest },
  ref
) {
  return (
    <Tag
      ref={ref}
      style={style}
      className={`rounded-lg bg-surface shadow-md dark:bg-gray-800 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
})
