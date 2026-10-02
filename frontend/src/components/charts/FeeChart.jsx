import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const defaultData = [
  { month: 'Jul', collected: 42000, pending: 8000 },
  { month: 'Aug', collected: 55000, pending: 5000 },
  { month: 'Sep', collected: 48000, pending: 12000 },
  { month: 'Oct', collected: 61000, pending: 4000 },
  { month: 'Nov', collected: 52000, pending: 8000 },
  { month: 'Dec', collected: 70000, pending: 3000 },
  { month: 'Jan', collected: 45000, pending: 15000 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const FeeChart = ({ data = defaultData, height = 280 }) => {
  const normalizedData = (data || []).map((item) => ({
    month: item.month || item.name || '',
    collected: item.collected ?? item.amount ?? item.total ?? 0,
    pending: item.pending ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={normalizedData}>
        <defs>
          <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="collected"
          name="Collected"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#colorCollected)"
        />
        <Area
          type="monotone"
          dataKey="pending"
          name="Pending"
          stroke="#f59e0b"
          strokeWidth={2}
          fill="url(#colorPending)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default FeeChart
