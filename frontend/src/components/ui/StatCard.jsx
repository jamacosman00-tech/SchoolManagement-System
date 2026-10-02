import React from 'react'
import clsx from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const colorVariants = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'bg-green-500',
    text: 'text-green-600 dark:text-green-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'bg-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'bg-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    icon: 'bg-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-400',
  },
}

const StatCard = ({
  title,
  value,
  change,
  changeLabel = 'from last month',
  icon: Icon,
  color = 'blue',
  loading = false,
  className = '',
}) => {
  const colors = colorVariants[color] || colorVariants.blue
  const isPositive = change > 0
  const isNeutral = change === 0 || change === undefined

  return (
    <div
      className={clsx(
        'stat-card group cursor-default',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className={clsx('p-3 rounded-xl', colors.icon)}>
          {Icon && <Icon size={22} className="text-white" />}
        </div>
        {change !== undefined && (
          <div
            className={clsx(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              isNeutral
                ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                : isPositive
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}
          >
            {isNeutral ? (
              <Minus size={12} />
            ) : isPositive ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="mt-4">
        {loading ? (
          <>
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{title}</p>
            {change !== undefined && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{changeLabel}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default StatCard
