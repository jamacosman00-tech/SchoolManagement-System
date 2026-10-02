import React from 'react'
import { Users, BookOpen, Clock, Calendar } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Link } from 'react-router-dom'

const MyClasses = () => {
  const classes = [
    { id: '1', name: 'Grade 10', section: 'A', role: 'Class Lead & Mathematics Teacher', students: 34, schedule: 'Mon-Fri 08:30 AM', room: 'Room 101' },
    { id: '2', name: 'Grade 11', section: 'A', role: 'Computer Science Faculty', students: 28, schedule: 'Mon, Wed, Fri 01:00 PM', room: 'Lab 2' },
    { id: '3', name: 'Grade 12', section: 'B', role: 'Advanced Calculus Faculty', students: 31, schedule: 'Tue, Thu 10:00 AM', room: 'Room 302' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Assigned Cohorts</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of sections and student groups under your academic supervision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-lg">
                {c.section}
              </div>
              <Badge variant="info">{c.room}</Badge>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{c.name} - Section {c.section}</h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{c.role}</p>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gray-400" />
                <span>{c.students} Enrolled Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span>{c.schedule}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <Link to="/teacher/attendance" className="flex-1">
                <Button size="sm" variant="outline" className="w-full">Attendance</Button>
              </Link>
              <Link to="/teacher/grades" className="flex-1">
                <Button size="sm" className="w-full">Grades</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyClasses
