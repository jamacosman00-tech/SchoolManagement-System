import React, { useState } from 'react'
import { Download, TrendingUp, BarChart2, PieChart, Users, DollarSign, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import AttendanceChart from '../../components/charts/AttendanceChart'
import FeeChart from '../../components/charts/FeeChart'
import PerformanceChart from '../../components/charts/PerformanceChart'
import StatCard from '../../components/ui/StatCard'

const Reports = () => {
  const [reportType, setReportType] = useState('attendance')

  const handleExport = (type) => {
    toast.success(`Exporting ${type} CSV report...`)
  }

  const attendanceData = [
    { day: 'Sat', present: 1190, absent: 35, late: 15 },
    { day: 'Sun', present: 1210, absent: 20, late: 10 },
    { day: 'Mon', present: 1180, absent: 45, late: 15 },
    { day: 'Tue', present: 1205, absent: 25, late: 10 },
    { day: 'Wed', present: 1175, absent: 50, late: 15 },
  ]

  const performanceData = [
    { exam: 'Unit 1', score: 78, average: 72 },
    { exam: 'Unit 2', score: 82, average: 75 },
    { exam: 'Midterm', score: 89, average: 76 },
    { exam: 'Unit 3', score: 85, average: 77 },
    { exam: 'Final Prep', score: 94, average: 80 },
  ]

  const feeData = [
    { month: 'Oct', amount: 35000 },
    { month: 'Nov', amount: 48000 },
    { month: 'Dec', amount: 42000 },
    { month: 'Jan', amount: 65000 },
    { month: 'Feb', amount: 58000 },
    { month: 'Mar', amount: 72000 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Institutional Reports & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generate aggregate school performance, attendance trends, and financial reports.
          </p>
        </div>
        <Button icon={Download} onClick={() => handleExport(reportType)}>
          Export CSV Report
        </Button>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-3 overflow-x-auto">
        {[
          { id: 'attendance', label: 'Attendance Analysis' },
          { id: 'academic', label: 'Academic Performance' },
          { id: 'financial', label: 'Financial Statements' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition ${
              reportType === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {reportType === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard title="Overall Attendance" value="94.2%" variant="success" />
            <StatCard title="Average Absentees" value="34 / day" variant="danger" />
            <StatCard title="Average Late Arrivals" value="13 / day" variant="warning" />
          </div>
          <Card title="Attendance Volume Trend">
            <div className="h-80 w-full pt-4">
              <AttendanceChart data={attendanceData} />
            </div>
          </Card>
        </div>
      )}

      {reportType === 'academic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard title="Schoolwide GPA" value="3.54 / 4.0" variant="primary" />
            <StatCard title="Exam Pass Rate" value="96.8%" variant="success" />
            <StatCard title="Honor Roll Students" value="142" variant="warning" />
          </div>
          <Card title="Term Over Term Academic Progress">
            <div className="h-80 w-full pt-4">
              <PerformanceChart data={performanceData} />
            </div>
          </Card>
        </div>
      )}

      {reportType === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard title="Total YTD Revenue" value="$320,000" variant="success" />
            <StatCard title="Outstanding Receivables" value="$32,000" variant="warning" />
            <StatCard title="Collection Efficiency" value="91.4%" variant="primary" />
          </div>
          <Card title="Monthly Revenue Trajectory">
            <div className="h-80 w-full pt-4">
              <FeeChart data={feeData} />
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Reports
