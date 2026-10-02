import React from 'react'
import { BookMarked, Calendar, Award, CheckCircle2, Clock, Bell, FileText } from 'lucide-react'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import PerformanceChart from '../../components/charts/PerformanceChart'

const StudentDashboard = () => {
  const performanceData = [
    { exam: 'Quiz 1', score: 85, average: 75 },
    { exam: 'Quiz 2', score: 92, average: 78 },
    { exam: 'Midterm', score: 88, average: 80 },
    { exam: 'Unit Test', score: 94, average: 82 },
    { exam: 'Lab Exam', score: 96, average: 84 },
  ]

  const upcomingExams = [
    { title: 'Spring Midterm 2026', subject: 'Advanced Mathematics', date: 'April 20, 2026', time: '09:00 AM' },
    { title: 'Physics Mechanics Assessment', subject: 'Physics Mechanics', date: 'April 22, 2026', time: '09:00 AM' },
  ]

  const pendingAssignments = [
    { title: 'Calculus Problem Set 3', subject: 'Mathematics', due: 'In 4 days', maxMarks: 50 },
    { title: 'Newtonian Dynamics Lab Report', subject: 'Physics', due: 'In 7 days', maxMarks: 100 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Academic Portal</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back, Alex Sterling • Grade 10 - Section A
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Overall Attendance" value="95.8%" icon={CheckCircle2} variant="success" />
        <StatCard title="Current GPA" value="3.88 / 4.0" icon={Award} variant="primary" />
        <StatCard title="Enrolled Subjects" value="6 Courses" icon={BookMarked} variant="warning" />
        <StatCard title="Due Assignments" value="2 Tasks" icon={FileText} variant="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="My Exam Performance Trajectory" className="lg:col-span-2">
          <div className="h-72 w-full pt-4">
            <PerformanceChart data={performanceData} />
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Upcoming Exams">
            <div className="space-y-3 pt-2">
              {upcomingExams.map((ex, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
                  <div className="font-bold text-sm text-gray-900 dark:text-white">{ex.title}</div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{ex.subject}</div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1 font-mono">
                    <Calendar size={12} /> {ex.date} • {ex.time}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Due Assignments">
            <div className="space-y-3 pt-2">
              {pendingAssignments.map((a, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-gray-900 dark:text-white">{a.title}</div>
                    <div className="text-[11px] text-gray-400">{a.subject} • {a.maxMarks} pts</div>
                  </div>
                  <Badge variant="warning">{a.due}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
