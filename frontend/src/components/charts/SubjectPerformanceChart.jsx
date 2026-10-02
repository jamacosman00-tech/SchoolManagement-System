import React from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const defaultData = [
  { subject: 'Math', score: 85, fullMark: 100 },
  { subject: 'Science', score: 78, fullMark: 100 },
  { subject: 'English', score: 92, fullMark: 100 },
  { subject: 'History', score: 70, fullMark: 100 },
  { subject: 'Physics', score: 82, fullMark: 100 },
  { subject: 'Chemistry', score: 75, fullMark: 100 },
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {payload[0]?.payload?.subject}
        </p>
        <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
          Score: <span className="font-medium">{payload[0]?.value}%</span>
        </p>
      </div>
    )
  }
  return null
}

const SubjectPerformanceChart = ({ data = defaultData, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickCount={5}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export default SubjectPerformanceChart
