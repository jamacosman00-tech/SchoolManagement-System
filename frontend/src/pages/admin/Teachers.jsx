import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, GraduationCap, Mail, Phone, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { getTeachers } from '../../api/teachers'
import { createTeacher, updateTeacher, deleteTeacher } from '../../api/teachers'
import { getSubjects } from '../../api/subjects'

const INITIAL_TEACHERS = [
  { _id: '1', employeeId: 'EMP-001', user: { name: 'Prof. Marcus Vance', email: 'marcus.vance@school.com', phone: '+1 555-102-3948' }, qualification: 'Ph.D. in Pure Mathematics', experience: '12 years', subjects: ['Advanced Mathematics', 'Computer Science'], classes: ['Grade 10A', 'Grade 11A'], salary: '$75,000' },
  { _id: '2', employeeId: 'EMP-002', user: { name: 'Ms. Elena Rodriguez', email: 'elena.rodriguez@school.com', phone: '+1 555-203-4958' }, qualification: 'M.Sc. in Physics', experience: '8 years', subjects: ['Physics Mechanics', 'Chemistry'], classes: ['Grade 10A', 'Grade 10B'], salary: '$68,000' },
  { _id: '3', employeeId: 'EMP-003', user: { name: 'Mr. David Chen', email: 'david.chen@school.com', phone: '+1 555-304-5867' }, qualification: 'M.A. in English Literature', experience: '6 years', subjects: ['English Literature'], classes: ['Grade 10A'], salary: '$62,000' },
]

const Teachers = () => {
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    qualification: '',
    experience: '',
    subjects: 'Mathematics',
    salary: '70000',
  })

  useEffect(() => {
    loadTeachers()
    getSubjects().then((res) => setSubjects(res.data?.subjects || [])).catch(() => toast.error('Could not load subjects'))
  }, [])

  const loadTeachers = async () => {
    setLoading(true)
    try {
      const res = await getTeachers()
      setTeachers(res.data?.teachers || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load teachers')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setSelectedTeacher(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      employeeId: `EMP-00${teachers.length + 1}`,
      qualification: '',
      experience: '',
      subjects: 'General Science',
      salary: '65000',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (t) => {
    setSelectedTeacher(t)
    setFormData({
      name: t.user?.name || t.name || '',
      email: t.user?.email || t.email || '',
      phone: t.user?.phone || t.phone || '',
      employeeId: t.employeeId || '',
      qualification: t.qualification || '',
      experience: t.experience || '',
      subjects: Array.isArray(t.subjects) ? t.subjects.map((subject) => typeof subject === 'string' ? subject : subject.name).join(', ') : t.subjects || '',
      salary: t.salary || '65000',
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error('Please enter name and email')
      return
    }

    try { const subjectIds = subjects.filter((subject) => formData.subjects.split(',').map((x) => x.trim().toLowerCase()).includes(subject.name.toLowerCase())).map((subject) => subject._id); const payload = { name: formData.name, email: formData.email, phone: formData.phone, employeeId: formData.employeeId, qualification: formData.qualification, experience: Number.parseFloat(formData.experience) || 0, salary: Number.parseFloat(String(formData.salary).replace('$', '')) || 0, subjects: subjectIds }; if (selectedTeacher) await updateTeacher(selectedTeacher._id, payload); else await createTeacher(payload); await loadTeachers(); toast.success(selectedTeacher ? 'Teacher updated' : 'Teacher created'); setIsModalOpen(false) } catch (error) { toast.error(error.response?.data?.message || 'Could not save teacher') }
  }

  const handleDelete = async () => {
    try { await deleteTeacher(deleteId); setTeachers(teachers.filter((t) => t._id !== deleteId)); toast.success('Teacher deleted') } catch (error) { toast.error(error.response?.data?.message || 'Could not delete teacher') }
    setDeleteId(null)
  }

  const filteredTeachers = teachers.filter((t) => {
    const name = t.user?.name || t.name || ''
    const emp = t.employeeId || ''
    return name.toLowerCase().includes(search.toLowerCase()) || emp.toLowerCase().includes(search.toLowerCase())
  })

  const columns = [
    {
      key: 'user',
      label: 'Faculty Member',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.user?.name || row.name} size="sm" />
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{row.user?.name || row.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{row.user?.email || row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'employeeId',
      label: 'ID',
      render: (v) => <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{v}</span>,
    },
    {
      key: 'qualification',
      label: 'Qualifications',
      render: (_, row) => (
        <div>
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{row.qualification}</div>
          <div className="text-xs text-gray-500">{row.experience} experience</div>
        </div>
      ),
    },
    {
      key: 'subjects',
      label: 'Assigned Subjects',
      render: (v) => {
        const list = Array.isArray(v) ? v : (v ? [v] : [])
        if (list.length === 0) return <span className="text-xs text-gray-400">None</span>
        return (
          <div className="flex flex-wrap gap-1">
            {list.map((sub, i) => {
              const label = typeof sub === 'object' && sub !== null ? (sub.name || sub.code || 'Subject') : String(sub || '')
              return <Badge key={i} variant="info">{label}</Badge>
            })}
          </div>
        )
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: () => <Badge variant="success">Active</Badge>,
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher & Faculty Directory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage teaching staff, departmental assignments, and contact details.
          </p>
        </div>
        <Button icon={Plus} onClick={handleOpenAdd}>
          Add Teacher
        </Button>
      </div>

      <Card>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search teacher by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </Card>

      <Card>
        <Table columns={columns} data={filteredTeachers} loading={loading} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTeacher ? 'Edit Faculty Record' : 'Register New Teacher'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Qualifications</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g. M.Sc. in Physics"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Experience</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g. 5 years"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Subjects (comma separated)</label>
              <input
                type="text"
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g. Mathematics, Physics"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedTeacher ? 'Save Changes' : 'Add Teacher'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remove Teacher Record"
        message="Are you sure you want to remove this faculty record from the system?"
      />
    </div>
  )
}

export default Teachers
