import React from 'react'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  pageSize = 10,
  onPageChange,
  className = '',
}) => {
  const from = Math.min((currentPage - 1) * pageSize + 1, totalRecords)
  const to = Math.min(currentPage * pageSize, totalRecords)

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }
    if (currentPage - delta > 2) range.unshift('...')
    if (currentPage + delta < totalPages - 1) range.push('...')
    if (totalPages > 1) {
      range.unshift(1)
      if (totalPages > 1) range.push(totalPages)
    }
    return range
  }

  if (totalPages <= 1 && totalRecords <= pageSize) return null

  return (
    <div className={clsx('flex items-center justify-between flex-wrap gap-3 mt-4', className)}>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-700 dark:text-gray-200">{from}</span> to{' '}
        <span className="font-medium text-gray-700 dark:text-gray-200">{to}</span> of{' '}
        <span className="font-medium text-gray-700 dark:text-gray-200">{totalRecords}</span> records
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={clsx(
              'min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-primary-600 text-white shadow-sm'
                : page === '...'
                ? 'cursor-default text-gray-400 dark:text-gray-500'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
