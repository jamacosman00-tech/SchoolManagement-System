import React, { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  inputClassName = '',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={16} className="text-gray-400 dark:text-gray-500" />
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={clsx(
            'block w-full rounded-lg border text-sm',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-white',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'transition-colors duration-200',
            Icon ? 'pl-10' : 'pl-3.5',
            IconRight ? 'pr-10' : 'pr-3.5',
            'py-2.5',
            error
              ? 'border-red-400 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-600',
            disabled && 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-700',
            inputClassName
          )}
          {...props}
        />
        {IconRight && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <IconRight size={16} className="text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
