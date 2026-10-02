import React from 'react'
import clsx from 'clsx'

const EmptyState = ({
  icon: Icon,
  title = 'No data found',
  description = 'There are no records to display.',
  action,
  className = '',
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      {Icon && (
        <div className="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
          <Icon size={32} className="text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default EmptyState
