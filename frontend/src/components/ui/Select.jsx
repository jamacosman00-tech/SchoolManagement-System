import React, { forwardRef } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  className = '',
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
        <select
          ref={ref}
          disabled={disabled}
          className={clsx(
            'block w-full appearance-none rounded-lg border text-sm',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-white',
            'pl-3.5 pr-10 py-2.5',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'transition-colors duration-200',
            error
              ? 'border-red-400 dark:border-red-500'
              : 'border-gray-300 dark:border-gray-600',
            disabled && 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-700'
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center">
          <ChevronDown size={16} className="text-gray-400 dark:text-gray-500" />
        </div>
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

Select.displayName = 'Select'

export default Select
