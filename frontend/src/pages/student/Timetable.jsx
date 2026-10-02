import React from 'react'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const StudentTimetable = () => {
  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday']

  const scheduleData = {
    Saturday: [
      { time: '08:30 - 09:30', subject: 'Advanced Mathematics', teacher: 'Prof. Marcus Vance', room: 'Room 101' },
      { time: '09:45 - 10:45', subject: 'English Literature', teacher: 'Mr. David Chen', room: 'Room 204' },
      { time: '11:00 - 12:00', subject: 'Physics Mechanics', teacher: 'Ms. Elena Rodriguez', room: 'Physics Lab' },
    ],
    Sunday: [
      { time: '08:30 - 09:30', subject: 'General Chemistry', teacher: 'Ms. Elena Rodriguez', room: 'Chem Lab' },
      { time: '09:45 - 10:45', subject: 'Advanced Mathematics', teacher: 'Prof. Marcus Vance', room: 'Room 101' },
      { time: '13:00 - 14:00', subject: 'Physical Education', teacher: 'Coach Roberts', room: 'Main Gymnasium' },
    ],
    Monday: [
      { time: '08:30 - 09:30', subject: 'Physics Mechanics', teacher: 'Ms. Elena Rodriguez', room: 'Physics Lab' },
      { time: '09:45 - 10:45', subject: 'English Literature', teacher: 'Mr. David Chen', room: 'Room 204' },
      { time: '11:00 - 12:00', subject: 'Advanced Mathematics', teacher: 'Prof. Marcus Vance', room: 'Room 101' },
    ],
    Tuesday: [
      { time: '08:30 - 09:30', subject: 'Computer Science', teacher: 'Prof. Marcus Vance', room: 'Computer Lab 2' },
      { time: '09:45 - 10:45', subject: 'General Chemistry', teacher: 'Ms. Elena Rodriguez', room: 'Chem Lab' },
      { time: '11:00 - 12:00', subject: 'World History', teacher: 'Ms. Taylor', room: 'Room 105' },
    ],
    Wednesday: [
      { time: '08:30 - 09:30', subject: 'Advanced Mathematics', teacher: 'Prof. Marcus Vance', room: 'Room 101' },
      { time: '09:45 - 10:45', subject: 'Physics Problem Lab', teacher: 'Ms. Elena Rodriguez', room: 'Physics Lab' },
      { time: '11:00 - 12:00', subject: 'Weekly Academic Assembly', teacher: 'Administration', room: 'Auditorium' },
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Class Timetable</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Grade 10 - Section A • Academic Year 2026-2027
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {days.map((day) => (
          <div key={day} className="space-y-3">
            <div className="p-3 rounded-xl bg-indigo-600 text-white font-bold text-sm text-center shadow-sm">
              {day}
            </div>

            <div className="space-y-3">
              {(scheduleData[day] || []).map((slot, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {slot.time}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-gray-900 dark:text-white leading-tight">
                    {slot.subject}
                  </div>
                  <div className="text-[11px] text-gray-500">{slot.teacher}</div>
                  <div className="pt-1 flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                    <MapPin size={10} />
                    {slot.room}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudentTimetable
