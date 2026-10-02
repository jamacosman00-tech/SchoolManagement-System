import React from 'react'
import { PenSquare, Calendar, Clock, AlertCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const StudentExams = () => {
  const exams = [
    { name: 'Spring Midterm 2026', subject: 'Advanced Mathematics', date: 'April 20, 2026', time: '09:00 AM - 11:00 AM', room: 'Hall A', maxMarks: 100, passMarks: 40, instructions: 'Scientific calculators allowed. ID card mandatory.' },
    { name: 'Physics Mechanics Assessment', subject: 'Physics Mechanics', date: 'April 22, 2026', time: '09:00 AM - 11:00 AM', room: 'Hall B', maxMarks: 100, passMarks: 40, instructions: 'Formula tables provided.' },
    { name: 'Literature Essay Test', subject: 'English Literature', date: 'April 25, 2026', time: '10:00 AM - 11:30 AM', room: 'Room 204', maxMarks: 50, passMarks: 20, instructions: 'Bring personal writing stationery.' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Schedules & Instructions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upcoming midterm and term evaluations schedule.
        </p>
      </div>

      <div className="space-y-4">
        {exams.map((ex, idx) => (
          <Card key={idx} className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{ex.name}</h3>
                  <Badge variant="info">{ex.room}</Badge>
                </div>
                <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {ex.subject}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-300 font-mono">
                  <span className="flex items-center gap-1.5"><Calendar size={13} /> {ex.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={13} /> {ex.time}</span>
                  <span>Max: {ex.maxMarks} pts (Pass: {ex.passMarks})</span>
                </div>
                <div className="pt-2 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span><strong>Instructions:</strong> {ex.instructions}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default StudentExams
