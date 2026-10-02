import React from 'react'
import { Users, GraduationCap, BookOpen, Calendar, Award } from 'lucide-react'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Link } from 'react-router-dom'

const Children = () => {
  const children = [
    {
      id: '1',
      name: 'Alex Sterling',
      admissionNo: 'ADM-2026-001',
      class: 'Grade 10 - Section A',
      classTeacher: 'Prof. Marcus Vance',
      dob: 'May 14, 2010',
      bloodGroup: 'O+',
      attendance: '95.8%',
      gpa: '3.94',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Children (Wards)</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enrolled student profiles associated with your parent account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-4">
              <Avatar name={c.name} size="lg" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{c.name}</h3>
                <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {c.admissionNo} • {c.class}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
              <div>
                <span className="text-gray-400 block">Class Teacher</span>
                <span className="font-semibold text-gray-900 dark:text-white">{c.classTeacher}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Blood Group</span>
                <span className="font-semibold text-gray-900 dark:text-white">{c.bloodGroup}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Attendance Rate</span>
                <span className="font-semibold text-emerald-600">{c.attendance}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Current GPA</span>
                <span className="font-semibold text-indigo-600">{c.gpa} / 4.0</span>
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <Link to="/parent/performance" className="flex-1">
                <Button size="sm" variant="outline" className="w-full">Academic Reports</Button>
              </Link>
              <Link to="/parent/fees" className="flex-1">
                <Button size="sm" className="w-full">Fee Invoices</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Children
