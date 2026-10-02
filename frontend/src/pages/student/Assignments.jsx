import React, { useState, useEffect } from 'react'
import { FileText, Calendar, Upload, CheckCircle2, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import api from '../../api/axios'
import { submitAssignment } from '../../api/assignments'

const INITIAL_ASSIGNMENTS = [
  { id: '1', title: 'Calculus Problem Set 3: Integrals', subject: 'Advanced Mathematics', dueDate: '2026-04-10', maxMarks: 50, status: 'submitted', grade: '48 / 50', feedback: 'Excellent work on Riemann integration.' },
  { id: '2', title: 'Newtonian Dynamics Lab Report', subject: 'Physics Mechanics', dueDate: '2026-04-15', maxMarks: 100, status: 'pending', grade: '—', feedback: '—' },
  { id: '3', title: 'Essay on Shakespearean Tragedies', subject: 'English Literature', dueDate: '2026-04-05', maxMarks: 40, status: 'graded', grade: '38 / 40', feedback: 'Deep insights and articulate composition.' },
]

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([])
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [submissionUrl, setSubmissionUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const reload = async () => { const { data } = await api.get('/assignments/my'); setAssignments((data.assignments || []).map((a) => ({ ...a, id: a._id, subject: a.subject?.name || '', dueDate: a.dueDate?.slice(0, 10), status: a.mySubmission ? (a.mySubmission.isGraded ? 'graded' : 'submitted') : 'pending', grade: a.mySubmission?.marks ?? '—', feedback: a.mySubmission?.feedback || '—' }))) }
  useEffect(() => { reload().catch((e) => toast.error(e.response?.data?.message || 'Could not load assignments')) }, [])

  const handleOpenSubmit = (a) => {
    setSelectedAssignment(a)
    setSubmissionUrl('')
  }

  const handleSubmitWork = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try { await submitAssignment(selectedAssignment.id, { fileUrl: submissionUrl }); await reload(); setSelectedAssignment(null); toast.success('Assignment submitted') } catch (error) { toast.error(error.response?.data?.message || 'Could not submit assignment') } finally { setIsSubmitting(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coursework & Assignments</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Submit homework, view teacher evaluations, and keep track of deadlines.
        </p>
      </div>

      <div className="space-y-4">
        {assignments.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">{a.title}</h3>
                  <Badge variant={a.status === 'graded' ? 'success' : a.status === 'submitted' ? 'info' : 'warning'}>
                    {a.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  {a.subject} • Max Score: {a.maxMarks} pts
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                  <Calendar size={13} /> Due Date: {a.dueDate}
                </div>
                {a.feedback !== '—' && (
                  <div className="mt-2 text-xs p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                    <strong>Teacher Feedback:</strong> {a.feedback} ({a.grade})
                  </div>
                )}
              </div>

              <div>
                {a.status === 'pending' ? (
                  <Button size="sm" icon={Upload} onClick={() => handleOpenSubmit(a)}>
                    Submit Assignment
                  </Button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 size={16} /> Work Submitted
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        title={`Submit: ${selectedAssignment?.title}`}
        size="md"
      >
        <form onSubmit={handleSubmitWork} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Submission Link / Cloud File URL
            </label>
            <input
              type="text"
              required
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="https://drive.google.com/your-submission-file"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Submission Notes (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Notes for instructor..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setSelectedAssignment(null)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Confirm & Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default StudentAssignments
