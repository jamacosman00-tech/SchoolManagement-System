import React from 'react'
import { Award, BarChart2, CheckCircle2, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import SubjectPerformanceChart from '../../components/charts/SubjectPerformanceChart'

const StudentResults = () => {
  const examGrades = [
    { subject: 'Advanced Mathematics', score: 92, max: 100, grade: 'A+', gpa: 4.0, remarks: 'Outstanding problem solving' },
    { subject: 'Physics Mechanics', score: 88, max: 100, grade: 'A', gpa: 4.0, remarks: 'Strong theoretical grasp' },
    { subject: 'English Literature', score: 85, max: 100, grade: 'A', gpa: 3.7, remarks: 'Great analytical essay' },
    { subject: 'General Chemistry', score: 90, max: 100, grade: 'A+', gpa: 4.0, remarks: 'Excellent lab skills' },
    { subject: 'Computer Science', score: 95, max: 100, grade: 'A+', gpa: 4.0, remarks: 'Superb algorithm implementation' },
  ]

  const radarData = [
    { subject: 'Math', score: 92, fullMark: 100 },
    { subject: 'Physics', score: 88, fullMark: 100 },
    { subject: 'English', score: 85, fullMark: 100 },
    { subject: 'Chemistry', score: 90, fullMark: 100 },
    { subject: 'CS', score: 95, fullMark: 100 },
  ]

  const handleDownloadReport = () => {
    toast.success('Downloading Official Term Report Card PDF...')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Results & Report Card</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Official evaluation transcripts for Spring Term 2026.
          </p>
        </div>
        <Button icon={Download} onClick={handleDownloadReport}>
          Download Report Card
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Cumulative GPA" value="3.94 / 4.0" icon={Award} variant="primary" />
        <StatCard title="Overall Average" value="90.0%" icon={BarChart2} variant="success" />
        <StatCard title="Term Standing" value="Top 5% of Class" icon={CheckCircle2} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Subject Proficiency Radar" className="lg:col-span-1">
          <div className="h-72 w-full pt-2">
            <SubjectPerformanceChart data={radarData} />
          </div>
        </Card>

        <Card title="Grading Breakdown" className="lg:col-span-2">
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Subject Course</th>
                  <th className="px-4 py-3 text-left">Marks</th>
                  <th className="px-4 py-3 text-left">Letter Grade</th>
                  <th className="px-4 py-3 text-left">GPA Points</th>
                  <th className="px-4 py-3 text-left">Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {examGrades.map((g, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{g.subject}</td>
                    <td className="px-4 py-3 font-mono">{g.score} / {g.max}</td>
                    <td className="px-4 py-3"><Badge variant="success">{g.grade}</Badge></td>
                    <td className="px-4 py-3 font-semibold">{g.gpa.toFixed(1)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{g.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default StudentResults
