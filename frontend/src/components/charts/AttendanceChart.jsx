import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const defaultData = [
  { day: 'Sat', present: 42, absent: 5, late: 3 },
  { day: 'Sun', present: 44, absent: 3, late: 3 },
  { day: 'Mon', present: 38, absent: 8, late: 4 },
  { day: 'Tue', present: 45, absent: 2, late: 3 },
  { day: 'Wed', present: 40, absent: 6, late: 4 },
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
            <span className="font-medium text-gray-900 dark:text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const AttendanceChart = ({ data = defaultData, height = 280 }) => {
  const normalizedData = (data || []).map((item) => ({
    day: item.day || item.name || '',
    present: item.present ?? item.Present ?? 0,
    absent: item.absent ?? item.Absent ?? 0,
    late: item.late ?? item.Late ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={normalizedData} barSize={10} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
          iconType="circle"
          iconSize={8}
        />
        <Bar dataKey="present" name="Present" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
        <Bar dataKey="late" name="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default AttendanceChart
