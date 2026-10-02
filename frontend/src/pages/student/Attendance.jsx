import React from 'react'
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import AttendanceChart from '../../components/charts/AttendanceChart'

const StudentAttendance = () => {
  const attendanceHistory = [
    { date: '2026-04-01', day: 'Wednesday', status: 'present', remarks: 'On time' },
    { date: '2026-03-31', day: 'Tuesday', status: 'present', remarks: 'On time' },
    { date: '2026-03-30', day: 'Monday', status: 'late', remarks: '10 mins traffic delay' },
    { date: '2026-03-27', day: 'Friday', status: 'present', remarks: 'On time' },
    { date: '2026-03-26', day: 'Thursday', status: 'present', remarks: 'On time' },
    { date: '2026-03-25', day: 'Wednesday', status: 'absent', remarks: 'Medical appointment' },
    { date: '2026-03-24', day: 'Tuesday', status: 'present', remarks: 'On time' },
  ]

  const chartData = [
    { day: 'W1', present: 5, absent: 0, late: 0 },
    { day: 'W2', present: 4, absent: 1, late: 0 },
    { day: 'W3', present: 5, absent: 0, late: 0 },
    { day: 'W4', present: 4, absent: 0, late: 1 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Attendance Record</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Attendance summary and historical verification logs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Attendance Rate" value="95.8%" variant="success" />
        <StatCard title="Total Present" value="112 Days" variant="primary" />
        <StatCard title="Total Absent" value="3 Days" variant="danger" />
        <StatCard title="Late Arrivals" value="2 Days" variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Monthly Attendance Breakdown" className="lg:col-span-2">
          <div className="h-72 w-full pt-4">
            <AttendanceChart data={chartData} />
          </div>
        </Card>

        <Card title="Recent Roll Call Records">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {attendanceHistory.map((rec, i) => (
              <div key={i} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white font-mono">{rec.date}</div>
                  <div className="text-gray-400">{rec.day} • {rec.remarks}</div>
                </div>
                <Badge variant={rec.status === 'present' ? 'success' : rec.status === 'late' ? 'warning' : 'error'}>
                  {rec.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default StudentAttendance
