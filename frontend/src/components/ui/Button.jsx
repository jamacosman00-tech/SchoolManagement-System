import React from 'react'
import clsx from 'clsx'
import Spinner from './Spinner'

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-400 dark:hover:bg-gray-700',
  outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20',
  'outline-danger': 'bg-transparent border border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-400 dark:hover:bg-red-900/20',
}

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon = null,
  iconRight = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        'transition-all duration-200',
        variants[variant],
        sizes[size],
        isDisabled && 'opacity-60 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="sm" color={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'white' : 'primary'} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && !iconRight && <Icon size={size === 'sm' || size === 'xs' ? 14 : 16} />}
          {children}
          {Icon && iconRight && <Icon size={size === 'sm' || size === 'xs' ? 14 : 16} />}
        </>
      )}
    </button>
  )
}

export default Button
