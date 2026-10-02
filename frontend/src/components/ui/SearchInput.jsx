import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import clsx from 'clsx'

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value || '')
  const timerRef = useRef(null)

  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  const handleChange = (e) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onChange(newValue)
    }, debounceMs)
  }

  const handleClear = () => {
    setLocalValue('')
    onChange('')
    clearTimeout(timerRef.current)
  }

  return (
    <div className={clsx('relative', className)}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
      />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

export default SearchInput
