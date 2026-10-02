import React from 'react'
import { Bell, CheckCircle2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const StudentNotifications = () => {
  const notifications = [
    { id: 1, title: 'Spring Semester Midterm Schedule Released', message: 'The comprehensive timetable for Spring 2026 midterm examinations is now published in the portal.', time: '2 hours ago', type: 'info', read: false },
    { id: 2, title: 'Upcoming Science Fair & Exhibition', message: 'All students are invited to register for the Annual STEM Science Fair by next Friday.', time: '1 day ago', type: 'success', read: true },
    { id: 3, title: 'Library Book Return Reminder', message: 'Please return any borrowed reference textbooks before the examination period.', time: '3 days ago', type: 'warning', read: true },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Notifications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Official bulletins, academic alerts, and school notices.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className="p-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mt-0.5">
                <Bell size={18} />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">{n.title}</h3>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{n.message}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default StudentNotifications
