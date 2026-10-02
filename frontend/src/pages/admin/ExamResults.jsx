import React, { useState, useEffect } from 'react'
import { BarChart2, Save, Download, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { getExams, getExamResults, enterResults } from '../../api/exams'
import { getStudents } from '../../api/students'

const INITIAL_RESULTS = [
  { studentId: '1', name: 'Alex Sterling', rollNo: '10A-01', marks: 92, grade: 'A+', remarks: 'Outstanding analytical clarity' },
  { studentId: '2', name: 'Emma Garcia', rollNo: '10A-02', marks: 88, grade: 'A', remarks: 'Consistent problem solving' },
  { studentId: '3', name: 'Liam Johnson', rollNo: '10A-03', marks: 74, grade: 'B', remarks: 'Good, work on calculus proofs' },
  { studentId: '4', name: 'Sophia Williams', rollNo: '10A-04', marks: 85, grade: 'A', remarks: 'Very good grasp of concepts' },
  { studentId: '5', name: 'Noah Brown', rollNo: '10A-05', marks: 63, grade: 'C', remarks: 'Needs revision in trigonometry' },
]

const ExamResults = () => {
  const [selectedExam, setSelectedExam] = useState('')
  const [exams, setExams] = useState([])
  const [results, setResults] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => { getExams().then(({ data }) => { const rows = data.exams || []; setExams(rows); if (rows[0]) setSelectedExam(rows[0]._id) }).catch((e) => toast.error(e.response?.data?.message || 'Could not load exams')) }, [])
  useEffect(() => { if (!selectedExam) return; getExamResults(selectedExam).then(async ({ data }) => { const byStudent = new Map((data.results || []).map((r) => [r.student?._id, r])); if (!data.exam?.class?._id) { setResults((data.results || []).map((r) => ({ ...r, studentId: r.student?._id, name: r.student?.user?.name || 'Student', rollNo: r.student?.rollNo || '', marks: r.marksObtained }))); return } const roster = await getStudents({ classId: data.exam.class._id, limit: 100 }); setResults((roster.data.students || []).map((student) => { const result = byStudent.get(student._id); return result ? { ...result, studentId: student._id, name: student.user?.name || 'Student', rollNo: student.rollNo || '', marks: result.marksObtained } : { studentId: student._id, name: student.user?.name || 'Student', rollNo: student.rollNo || '', marks: 0, grade: 'F', remarks: '' } })) }).catch((e) => toast.error(e.response?.data?.message || 'Could not load results')) }, [selectedExam])

  const handleMarkChange = (studentId, newMarks) => {
    const m = Number(newMarks)
    let g = 'F'
    if (m >= 90) g = 'A+'
    else if (m >= 80) g = 'A'
    else if (m >= 70) g = 'B'
    else if (m >= 60) g = 'C'
    else if (m >= 50) g = 'D'

    setResults(
      results.map((r) =>
        r.studentId === studentId
          ? { ...r, marks: m, grade: g }
          : r
      )
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try { await enterResults(selectedExam, results.map((r) => ({ studentId: r.studentId, marksObtained: r.marks, remarks: r.remarks, isAbsent: r.isAbsent || false }))); toast.success('Exam results saved') } catch (error) { toast.error(error.response?.data?.message || 'Could not save results') } finally { setIsSaving(false) }
  }

  const marksList = results.map((r) => r.marks)
  const avgMarks = (marksList.reduce((a, b) => a + b, 0) / marksList.length).toFixed(1)
  const highestMarks = Math.max(...marksList)
  const passRate = ((results.filter((r) => r.marks >= 40).length / results.length) * 100).toFixed(0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Results & Grading</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter marks, automatically compute GPA and letter grades, and publish report cards.
          </p>
        </div>
        <div className="flex gap-2">
          <Button icon={Save} loading={isSaving} onClick={handleSave}>
            Save & Publish Grades
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Class Average" value={`${avgMarks} / 100`} variant="primary" />
        <StatCard title="Top Score" value={`${highestMarks} / 100`} variant="success" />
        <StatCard title="Pass Rate" value={`${passRate}%`} variant="warning" />
      </div>

      <Card>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Select Examination</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full sm:w-96 text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
          >
            {exams.map((exam) => <option key={exam._id} value={exam._id}>{exam.name} - {exam.subject?.name} (Max {exam.maxMarks})</option>)}
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Roll No</th>
                <th className="px-4 py-3 text-left">Marks (Max 100)</th>
                <th className="px-4 py-3 text-left">Grade</th>
                <th className="px-4 py-3 text-left">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {results.map((r) => (
                <tr key={r.studentId}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.name} size="sm" />
                      <span className="font-semibold text-gray-900 dark:text-white">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.rollNo}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={r.marks}
                      onChange={(e) => handleMarkChange(r.studentId, e.target.value)}
                      className="w-20 px-2.5 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={r.grade.startsWith('A') ? 'success' : r.grade.startsWith('B') ? 'info' : 'warning'}>
                      {r.grade}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default ExamResults
