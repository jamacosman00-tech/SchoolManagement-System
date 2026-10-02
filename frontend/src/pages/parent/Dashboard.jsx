import React from 'react'
import { Users, CheckCircle2, TrendingUp, DollarSign, BookOpen, Calendar } from 'lucide-react'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import PerformanceChart from '../../components/charts/PerformanceChart'

const ParentDashboard = () => {
  const child = {
    name: 'Alex Sterling',
    class: 'Grade 10 - Section A',
    rollNo: '10A-01',
    attendance: '95.8%',
    gpa: '3.94',
    feeStatus: 'Paid',
  }

  const performanceData = [
    { exam: 'Quiz 1', score: 85, average: 75 },
    { exam: 'Quiz 2', score: 92, average: 78 },
    { exam: 'Midterm', score: 88, average: 80 },
    { exam: 'Unit Test', score: 94, average: 82 },
    { exam: 'Lab Exam', score: 96, average: 84 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Parent Portal Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Supervise your ward's attendance, academic excellence, and fee status.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-500/20">
        <div className="flex items-center gap-4">
          <Avatar name={child.name} size="lg" className="border-2 border-white/40" />
          <div>
            <h2 className="text-lg font-bold">{child.name}</h2>
            <p className="text-xs text-indigo-100">{child.class} • Roll No: {child.rollNo}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">Academic Standing: Excellent</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Attendance Rate" value={child.attendance} icon={CheckCircle2} variant="success" />
        <StatCard title="Term Cumulative GPA" value={`${child.gpa} / 4.0`} icon={TrendingUp} variant="primary" />
        <StatCard title="Spring Tuition Status" value="Settled / Paid" icon={DollarSign} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Ward Academic Performance Trajectory" className="lg:col-span-2">
          <div className="h-72 w-full pt-4">
            <PerformanceChart data={performanceData} />
          </div>
        </Card>

        <Card title="Recent School Activities">
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
              <div className="font-bold text-gray-900 dark:text-white">Science Lab Practical Exam</div>
              <div className="text-gray-500">Alex scored 96/100 (Highest in Class)</div>
              <div className="text-gray-400 font-mono mt-1">April 01, 2026</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
              <div className="font-bold text-gray-900 dark:text-white">Spring Term Tuition Invoice</div>
              <div className="text-gray-500">Invoice $2,850 fully paid via Card</div>
              <div className="text-gray-400 font-mono mt-1">March 28, 2026</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ParentDashboard
