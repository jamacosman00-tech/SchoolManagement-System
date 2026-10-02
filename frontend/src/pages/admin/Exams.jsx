import React, { useState, useEffect } from 'react'
import { Plus, PenSquare, Calendar, Clock, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { getExams, createExam, updateExam, deleteExam } from '../../api/exams'
import { getSubjects } from '../../api/subjects'

const INITIAL_EXAMS = [
  { _id: '1', name: 'Spring Midterm 2026', subject: 'Advanced Mathematics', className: 'Grade 10', examType: 'Midterm', date: '2026-04-20', startTime: '09:00 AM', endTime: '11:00 AM', maxMarks: 100, passingMarks: 40 },
  { _id: '2', name: 'Physics Mechanics Assessment', subject: 'Physics Mechanics', className: 'Grade 10', examType: 'Midterm', date: '2026-04-22', startTime: '09:00 AM', endTime: '11:00 AM', maxMarks: 100, passingMarks: 40 },
  { _id: '3', name: 'Literature Essay & Comprehension', subject: 'English Literature', className: 'Grade 10', examType: 'Unit Test', date: '2026-04-25', startTime: '10:00 AM', endTime: '11:30 AM', maxMarks: 50, passingMarks: 20 },
  { _id: '4', name: 'Organic Chemistry Final Assessment', subject: 'Chemistry', className: 'Grade 11', examType: 'Final Term', date: '2026-05-15', startTime: '08:30 AM', endTime: '11:30 AM', maxMarks: 100, passingMarks: 40 },
]

const Exams = () => {
  const [exams, setExams] = useState([])
  const [subjects, setSubjects] = useState([])
  const reload = async () => {
    const { data } = await getExams()
    setExams(
      (data.exams || []).map((x) => ({
        ...x,
        subject: x.subject?.name || x.subject || '',
        className: `${x.class?.name || ''} - ${x.class?.section || ''}`,
        date: x.date ? (typeof x.date === 'string' ? x.date.slice(0, 10) : new Date(x.date).toISOString().slice(0, 10)) : '',
        examType: ({ midterm: 'Midterm', final: 'Final Term', quiz: 'Quiz', assignment: 'Assignment' })[x.examType] || x.examType,
      }))
    )
  }
  useEffect(() => { Promise.all([reload(), getSubjects().then((r) => setSubjects(r.data.subjects || []))]).catch((e) => toast.error(e.response?.data?.message || 'Could not load exams')) }, [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    subject: 'Advanced Mathematics',
    className: 'Grade 10',
    examType: 'Midterm',
    date: '2026-04-20',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    maxMarks: 100,
    passingMarks: 40,
  })

  const handleOpenAdd = () => {
    setSelectedExam(null)
    setFormData({
      name: '',
      subject: subjects[0]?.name || 'Advanced Mathematics',
      className: 'Grade 10',
      examType: 'Midterm',
      date: new Date().toISOString().slice(0, 10),
      startTime: '09:00 AM',
      endTime: '11:00 AM',
      maxMarks: 100,
      passingMarks: 40,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (e) => {
    setSelectedExam(e)
    setFormData({
      ...e,
      date: e.date ? (typeof e.date === 'string' ? e.date.slice(0, 10) : new Date(e.date).toISOString().slice(0, 10)) : '',
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      toast.error('Please enter exam title')
      return
    }

    try { const subject = subjects.find((s) => s.name === formData.subject); if (!subject) throw new Error('Select a valid subject'); const payload = { name: formData.name, subjectId: subject._id, classId: subject.class?._id || subject.class, examType: ({ 'Midterm': 'midterm', 'Final Term': 'final', 'Unit Test': 'quiz', Quiz: 'quiz' })[formData.examType] || 'quiz', date: formData.date, startTime: formData.startTime, endTime: formData.endTime, maxMarks: Number(formData.maxMarks), passingMarks: Number(formData.passingMarks) }; if (selectedExam) await updateExam(selectedExam._id, payload); else await createExam(payload); await reload(); toast.success('Exam saved'); setIsModalOpen(false) } catch (error) { toast.error(error.response?.data?.message || error.message || 'Could not save exam') }
  }

  const handleDelete = async () => {
    try { await deleteExam(deleteId); setExams(exams.filter((e) => e._id !== deleteId)); toast.success('Exam deleted') } catch (error) { toast.error(error.response?.data?.message || 'Could not delete exam') }
    setDeleteId(null)
    toast.success('Exam timetable removed')
  }

  const columns = [
    {
      key: 'name',
      label: 'Exam Title',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{row.name}</div>
          <div className="text-xs text-gray-500">{row.className} • Max {row.maxMarks} marks</div>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (v) => <span className="font-medium text-indigo-600 dark:text-indigo-400 text-sm">{v}</span>,
    },
    {
      key: 'examType',
      label: 'Type',
      render: (v) => <Badge variant="info">{v}</Badge>,
    },
    {
      key: 'date',
      label: 'Date & Time',
      render: (_, row) => (
        <div className="text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1 font-mono font-semibold">
            <Calendar size={12} className="text-gray-400" />
            {row.date}
          </div>
          <div className="flex items-center gap-1 text-gray-400 mt-0.5">
            <Clock size={12} />
            {row.startTime} - {row.endTime}
          </div>
        </div>
      ),
    },
    {
      key: 'passingMarks',
      label: 'Passing Threshold',
      render: (v, row) => (
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {v} / {row.maxMarks}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Examinations & Tests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Schedule terms, midterms, quizzes, and manage test requirements.
          </p>
        </div>
        <Button icon={Plus} onClick={handleOpenAdd}>
          Schedule Exam
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={exams} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedExam ? 'Edit Exam Schedule' : 'Schedule Examination'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Exam Title</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. Spring Midterm Examination"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Advanced Mathematics">Advanced Mathematics</option>
                <option value="Physics Mechanics">Physics Mechanics</option>
                <option value="English Literature">English Literature</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Exam Type</label>
              <select
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Midterm">Midterm</option>
                <option value="Final Term">Final Term</option>
                <option value="Unit Test">Unit Test</option>
                <option value="Quiz">Quiz</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Exam Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
              <input
                type="text"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="09:00 AM"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">End Time</label>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="11:00 AM"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Max Marks</label>
              <input
                type="number"
                value={formData.maxMarks}
                onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Passing Marks</label>
              <input
                type="number"
                value={formData.passingMarks}
                onChange={(e) => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{selectedExam ? 'Save Changes' : 'Schedule Exam'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Exam"
        message="Are you sure you want to cancel this scheduled exam?"
      />
    </div>
  )
}

export default Exams
