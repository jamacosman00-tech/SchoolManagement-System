import React, { useState } from 'react'
import clsx from 'clsx'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Spinner from './Spinner'

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data found',
  onRowClick,
  sortable = false,
  className = '',
  skeletonRows = 5,
}) => {
  const [sortField, setSortField] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (field) => {
    if (!sortable) return
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortField) return data
    return [...data].sort((a, b) => {
      const va = a[sortField] ?? ''
      const vb = b[sortField] ?? ''
      const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortField, sortDir])

  return (
    <div className={clsx('overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700', className)}>
      <table className="w-full min-w-max">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  'table-th select-none',
                  sortable && col.sortable !== false && 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200'
                )}
                style={{ width: col.width }}
                onClick={() => col.sortable !== false && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {sortable && col.sortable !== false && (
                    <span className="flex flex-col opacity-40">
                      <ChevronUp size={10} className={sortField === col.key && sortDir === 'asc' ? 'opacity-100' : ''} />
                      <ChevronDown size={10} className={sortField === col.key && sortDir === 'desc' ? 'opacity-100' : ''} />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="table-td">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-sm">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((row, i) => (
              <tr
                key={row._id || row.id || i}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  'transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50'
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="table-td">
                    {col.render
                      ? col.render(row[col.key], row)
                      : (typeof row[col.key] === 'object' && row[col.key] !== null
                          ? (row[col.key].name || row[col.key].title || '-')
                          : row[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
