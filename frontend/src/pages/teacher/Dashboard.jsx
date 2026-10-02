import React, { useState } from 'react'
import { BookOpen, Users, ClipboardCheck, FileText, Calendar, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import AttendanceChart from '../../components/charts/AttendanceChart'

const TeacherDashboard = () => {
  const attendanceData = [
    { day: 'Sat', present: 32, absent: 2, late: 0 },
    { day: 'Sun', present: 34, absent: 0, late: 0 },
    { day: 'Mon', present: 31, absent: 2, late: 1 },
    { day: 'Tue', present: 33, absent: 1, late: 0 },
    { day: 'Wed', present: 30, absent: 3, late: 1 },
  ]

  const todaySchedule = [
    { time: '08:30 - 09:30', subject: 'Advanced Mathematics', class: 'Grade 10 - A', room: 'Room 101' },
    { time: '10:00 - 11:00', subject: 'Calculus Workshop', class: 'Grade 11 - A', room: 'Room 204' },
    { time: '13:00 - 14:00', subject: 'Computer Science Lab', class: 'Grade 11 - A', room: 'Computer Lab 2' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Good day! Here is your teaching schedule and class overview.
          </p>
        </div>
        <Link to="/teacher/attendance">
          <Button icon={ClipboardCheck}>Mark Today's Attendance</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Assigned Classes" value="3 Classes" icon={BookOpen} variant="primary" />
        <StatCard title="Total Students" value="93 Students" icon={Users} variant="success" />
        <StatCard title="Pending Grading" value="18 Tasks" icon={FileText} variant="warning" />
        <StatCard title="Exams This Month" value="2 Scheduled" icon={Calendar} variant="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Today's Lecture Schedule" className="lg:col-span-1">
          <div className="space-y-3 pt-2">
            {todaySchedule.map((slot, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {slot.time}
                  </span>
                  <Badge variant="info">{slot.room}</Badge>
                </div>
                <div className="font-bold text-sm text-gray-900 dark:text-white">{slot.subject}</div>
                <div className="text-xs text-gray-500">{slot.class}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Weekly Attendance (My Class 10A)" className="lg:col-span-2">
          <div className="h-72 w-full pt-4">
            <AttendanceChart data={attendanceData} />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TeacherDashboard
