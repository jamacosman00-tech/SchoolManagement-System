import React from 'react'
import clsx from 'clsx'

const variants = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className={clsx('h-1.5 w-1.5 rounded-full', {
          'bg-green-500': variant === 'success',
          'bg-yellow-500': variant === 'warning',
          'bg-red-500': variant === 'error',
          'bg-blue-500': variant === 'info',
          'bg-gray-500': variant === 'neutral',
          'bg-primary-500': variant === 'primary',
        })} />
      )}
      {typeof children === 'object' && !React.isValidElement(children) && children !== null
        ? (children.name || children.label || children.title || children.code || String(children))
        : children}
    </span>
  )
}

export default Badge
