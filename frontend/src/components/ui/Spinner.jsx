import React from 'react'
import clsx from 'clsx'

const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizes = {
    xs: 'h-3 w-3 border',
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-2',
    xl: 'h-12 w-12 border-4',
  }

  const colors = {
    primary: 'border-primary-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
  }

  return (
    <div
      className={clsx(
        'animate-spin rounded-full',
        sizes[size],
        colors[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

export default Spinner
