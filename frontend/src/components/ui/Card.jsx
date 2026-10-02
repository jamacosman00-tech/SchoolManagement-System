import React from 'react'
import clsx from 'clsx'

const Card = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  bodyClassName = '',
  noPadding = false,
}) => {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm',
        className
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={clsx(!noPadding && 'px-6 py-5', bodyClassName)}>{children}</div>
    </div>
  )
}

export default Card
