import React from 'react'
import clsx from 'clsx'
import { getInitials } from '../../utils/helpers'

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
}

const colors = [
  'bg-primary-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
]

const getColorFromName = (name) => {
  if (!name) return colors[0]
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}

const Avatar = ({
  src,
  name,
  size = 'md',
  className = '',
  onClick,
}) => {
  const [imgError, setImgError] = React.useState(false)
  const bgColor = getColorFromName(name)

  return (
    <div
      className={clsx(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0',
        sizes[size],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={clsx(
            'h-full w-full flex items-center justify-center font-semibold text-white',
            bgColor
          )}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  )
}

export default Avatar
