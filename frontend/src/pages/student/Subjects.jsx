import React from 'react'
import { BookMarked, UserCheck, Clock, FileText } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const StudentSubjects = () => {
  const subjects = [
    { code: 'MATH-101', name: 'Advanced Mathematics', teacher: 'Prof. Marcus Vance', schedule: 'Mon, Wed, Fri (08:30 AM)', credits: '4 Credits', room: 'Room 101' },
    { code: 'PHYS-101', name: 'Physics Mechanics', teacher: 'Ms. Elena Rodriguez', schedule: 'Tue, Thu (09:00 AM)', credits: '4 Credits', room: 'Physics Lab' },
    { code: 'ENG-101', name: 'English Literature', teacher: 'Mr. David Chen', schedule: 'Mon, Wed (11:00 AM)', credits: '3 Credits', room: 'Room 204' },
    { code: 'CHEM-101', name: 'General Chemistry', teacher: 'Ms. Elena Rodriguez', schedule: 'Tue, Fri (01:00 PM)', credits: '4 Credits', room: 'Chemistry Lab' },
    { code: 'CS-201', name: 'Computer Science', teacher: 'Prof. Marcus Vance', schedule: 'Thursday (01:00 PM)', credits: '3 Credits', room: 'Computer Lab 2' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enrolled Subjects</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Curriculum overview, faculty contacts, and course syllabus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sub, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg">
                {sub.code}
              </span>
              <Badge variant="info">{sub.credits}</Badge>
            </div>

            <h3 className="font-bold text-base text-gray-900 dark:text-white">{sub.name}</h3>

            <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <UserCheck size={14} className="text-gray-400" />
                <span>Instructor: <strong>{sub.teacher}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span>{sub.schedule}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudentSubjects
