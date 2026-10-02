import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const defaultData = [
  { exam: 'Unit Test 1', score: 72, average: 68 },
  { exam: 'Quiz 1', score: 85, average: 74 },
  { exam: 'Mid Term', score: 78, average: 70 },
  { exam: 'Quiz 2', score: 90, average: 76 },
  { exam: 'Unit Test 2', score: 82, average: 72 },
  { exam: 'Final', score: 88, average: 75 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
            <span className="font-medium text-gray-900 dark:text-white">{entry.value}%</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const PerformanceChart = ({ data = defaultData, height = 280 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
        <XAxis
          dataKey="exam"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
          iconType="circle"
          iconSize={8}
        />
        <Line
          type="monotone"
          dataKey="score"
          name="My Score"
          stroke="#6366f1"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#6366f1' }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="average"
          name="Class Average"
          stroke="#94a3b8"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 3, fill: '#94a3b8' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default PerformanceChart
