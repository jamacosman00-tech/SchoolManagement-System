import React, { useState, useEffect } from 'react'
import { Plus, FileText, Calendar, CheckCircle2, Clock, Trash2, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { getAssignments, createAssignment, updateAssignment, deleteAssignment } from '../../api/assignments'
import { getSubjects } from '../../api/subjects'
import { getClasses } from '../../api/classes'
import { getTeachers } from '../../api/teachers'

const INITIAL_ASSIGNMENTS = [
  { _id: '1', title: 'Calculus Problem Set 3: Integrals', subject: 'Advanced Mathematics', className: 'Grade 10 - A', teacher: 'Prof. Marcus Vance', dueDate: '2026-04-10', maxMarks: 50, submissionsCount: 28, totalStudents: 34, status: 'Active' },
  { _id: '2', title: 'Newtonian Dynamics Lab Report', subject: 'Physics Mechanics', className: 'Grade 10 - A', teacher: 'Ms. Elena Rodriguez', dueDate: '2026-04-15', maxMarks: 100, submissionsCount: 15, totalStudents: 34, status: 'Active' },
  { _id: '3', title: 'Essay on Shakespearean Tragedies', subject: 'English Literature', className: 'Grade 10 - A', teacher: 'Mr. David Chen', dueDate: '2026-04-05', maxMarks: 40, submissionsCount: 34, totalStudents: 34, status: 'Graded' },
  { _id: '4', title: 'Binary Trees & Graphs Implementation', subject: 'Computer Science', className: 'Grade 11 - A', teacher: 'Prof. Marcus Vance', dueDate: '2026-04-18', maxMarks: 100, submissionsCount: 12, totalStudents: 28, status: 'Active' },
]

const Assignments = () => {
  const [assignments, setAssignments] = useState([])
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const reload = async () => {
    const { data } = await getAssignments()
    setAssignments(
      (data.assignments || []).map((a) => ({
        ...a,
        subject: a.subject?.name || a.subject || '',
        className: `${a.class?.name || ''} - ${a.class?.section || ''}`,
        teacher: a.teacher?.user?.name || a.teacher?.name || '',
        dueDate: a.dueDate ? (typeof a.dueDate === 'string' ? a.dueDate.slice(0, 10) : new Date(a.dueDate).toISOString().slice(0, 10)) : '',
      }))
    )
  }
  useEffect(() => { Promise.all([reload(), getSubjects().then((r) => setSubjects(r.data.subjects || [])), getClasses().then((r) => setClasses(r.data.classes || [])), getTeachers({ limit: 100 }).then((r) => setTeachers(r.data.teachers || []))]).catch((e) => toast.error(e.response?.data?.message || 'Could not load assignments')) }, [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    subject: 'Advanced Mathematics',
    className: 'Grade 10 - A',
    teacher: 'Prof. Marcus Vance',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    maxMarks: 100,
    description: '',
  })

  const handleOpenAdd = () => {
    setSelectedAssignment(null)
    setFormData({
      title: '',
      subject: subjects[0]?.name || 'Advanced Mathematics',
      className: classes[0] ? `${classes[0].name} - ${classes[0].section}` : 'Grade 10 - A',
      teacher: teachers[0]?.user?.name || 'Prof. Marcus Vance',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      maxMarks: 100,
      description: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (a) => {
    setSelectedAssignment(a)
    setFormData({
      title: a.title,
      subject: a.subject,
      className: a.className,
      teacher: a.teacher,
      dueDate: a.dueDate ? (typeof a.dueDate === 'string' ? a.dueDate.slice(0, 10) : new Date(a.dueDate).toISOString().slice(0, 10)) : '',
      maxMarks: a.maxMarks,
      description: a.description || '',
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.title) {
      toast.error('Please enter an assignment title')
      return
    }

    try { const subject = subjects.find((s) => s.name === formData.subject); const cls = classes.find((c) => `${c.name} - ${c.section}` === formData.className); const teacher = teachers.find((t) => (t.user?.name || t.name) === formData.teacher); if (!subject || !cls || !teacher) throw new Error('Select a valid subject, class, and teacher'); const payload = { title: formData.title, description: formData.description, subjectId: subject._id, classId: cls._id, teacherId: teacher._id, dueDate: formData.dueDate, maxMarks: formData.maxMarks }; if (selectedAssignment) await updateAssignment(selectedAssignment._id, payload); else await createAssignment(payload); await reload(); toast.success('Assignment saved'); setIsModalOpen(false) } catch (error) { toast.error(error.response?.data?.message || error.message || 'Could not save assignment') }
  }

  const handleDelete = async () => {
    try { await deleteAssignment(deleteId); setAssignments(assignments.filter((a) => a._id !== deleteId)); toast.success('Assignment deleted') } catch (error) { toast.error(error.response?.data?.message || 'Could not delete assignment') }
    setDeleteId(null)
    toast.success('Assignment deleted')
  }

  const columns = [
    {
      key: 'title',
      label: 'Assignment Title',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{row.title}</div>
          <div className="text-xs text-gray-500">{row.teacher} • Max {row.maxMarks} pts</div>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (v) => <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{v}</span>,
    },
    {
      key: 'className',
      label: 'Cohort Class',
      render: (v) => <Badge variant="neutral">{v}</Badge>,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (v) => (
        <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 font-mono">
          <Calendar size={14} className="text-gray-400" />
          {v}
        </span>
      ),
    },
    {
      key: 'submissionsCount',
      label: 'Submissions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <div className="w-20 bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full"
              style={{ width: `${(row.submissionsCount / row.totalStudents) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {row.submissionsCount}/{row.totalStudents}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <Badge variant={v === 'Graded' ? 'success' : 'warning'}>{v}</Badge>,
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments & Coursework</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create homework tasks, manage deadlines, and track student submission rates.
          </p>
        </div>
        <Button icon={Plus} onClick={handleOpenAdd}>
          Create Assignment
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={assignments} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAssignment ? 'Edit Coursework Task' : 'Publish New Assignment'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. Calculus Problem Set 3"
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
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Class</label>
              <select
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Grade 10 - A">Grade 10 - A</option>
                <option value="Grade 10 - B">Grade 10 - B</option>
                <option value="Grade 11 - A">Grade 11 - A</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Max Marks / Points</label>
              <input
                type="number"
                value={formData.maxMarks}
                onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Instructions & Guidelines</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Instructions for students..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{selectedAssignment ? 'Save Changes' : 'Publish Task'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? All submitted files will be permanently erased."
      />
    </div>
  )
}

export default Assignments
