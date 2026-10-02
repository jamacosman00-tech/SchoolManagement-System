import React, { useState, useEffect } from 'react'
import { Plus, BookMarked, Search, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../../api/subjects'
import { getClasses } from '../../api/classes'
import { getTeachers } from '../../api/teachers'

const INITIAL_SUBJECTS = [
  { _id: '1', name: 'Advanced Mathematics', code: 'MATH-101', className: 'Grade 10', teacherName: 'Prof. Marcus Vance', description: 'Calculus, Trigonometry & Matrices' },
  { _id: '2', name: 'Physics Mechanics', code: 'PHYS-101', className: 'Grade 10', teacherName: 'Ms. Elena Rodriguez', description: 'Classical Dynamics and Vectors' },
  { _id: '3', name: 'English Literature', code: 'ENG-101', className: 'Grade 10', teacherName: 'Mr. David Chen', description: 'World Literature & Academic Composition' },
  { _id: '4', name: 'Chemistry', code: 'CHEM-101', className: 'Grade 10', teacherName: 'Ms. Elena Rodriguez', description: 'Organic & Inorganic Molecular Dynamics' },
  { _id: '5', name: 'Computer Science', code: 'CS-201', className: 'Grade 11', teacherName: 'Prof. Marcus Vance', description: 'Data Structures, Algorithms & Web Dev' },
]

const Subjects = () => {
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const reload = async () => { const { data } = await getSubjects(); setSubjects((data.subjects || []).map((s) => ({ ...s, className: s.class?.name || '', teacherName: s.teacher?.user?.name || '' }))) }
  useEffect(() => { Promise.all([reload(), getClasses().then((r) => setClasses(r.data.classes || [])), getTeachers({ limit: 100 }).then((r) => setTeachers(r.data.teachers || []))]).catch((e) => toast.error(e.response?.data?.message || 'Could not load subjects')) }, [])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    className: 'Grade 10',
    teacherName: 'Prof. Marcus Vance',
    description: '',
  })

  const handleOpenAdd = () => {
    setSelectedSubject(null)
    setFormData({ name: '', code: `SUB-${100 + subjects.length + 1}`, className: 'Grade 10', teacherName: 'Prof. Marcus Vance', description: '' })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (s) => {
    setSelectedSubject(s)
    setFormData({ ...s })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.code) {
      toast.error('Please enter name and code')
      return
    }

    try { const cls = classes.find((c) => c.name === formData.className); const teacher = teachers.find((t) => (t.user?.name || t.name) === formData.teacherName); if (!cls) throw new Error('Create the selected class first'); const payload = { name: formData.name, code: formData.code, classId: cls._id, teacher: teacher?._id || null, description: formData.description }; if (selectedSubject) await updateSubject(selectedSubject._id, payload); else await createSubject(payload); await reload(); toast.success('Subject saved'); setIsModalOpen(false) } catch (error) { toast.error(error.response?.data?.message || error.message || 'Could not save subject') }
  }

  const handleDelete = async () => {
    try { await deleteSubject(deleteId); setSubjects(subjects.filter((s) => s._id !== deleteId)); toast.success('Subject deleted') } catch (error) { toast.error(error.response?.data?.message || 'Could not delete subject') }
    setDeleteId(null)
  }

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    {
      key: 'code',
      label: 'Subject Code',
      render: (v) => <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{v}</span>,
    },
    {
      key: 'name',
      label: 'Subject Title',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{row.name}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'className',
      label: 'Applicable Grade',
      render: (v) => <Badge variant="info">{v}</Badge>,
    },
    {
      key: 'teacherName',
      label: 'Subject Lead',
      render: (v) => <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{v}</span>,
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Curriculum Subjects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure taught disciplines, course codes, and teacher assignments.
          </p>
        </div>
        <Button icon={Plus} onClick={handleOpenAdd}>
          Add Subject
        </Button>
      </div>

      <Card>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search subjects or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </Card>

      <Card>
        <Table columns={columns} data={filtered} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedSubject ? 'Edit Subject' : 'Add New Subject'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Subject Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. Advanced Mathematics"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Course Code</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. MATH-101"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Grade Level</label>
            <select
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Assigned Teacher</label>
            <input
              type="text"
              value={formData.teacherName}
              onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Course Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{selectedSubject ? 'Save Changes' : 'Create Subject'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Subject"
        message="Are you sure you want to remove this course from the academic catalog?"
      />
    </div>
  )
}

export default Subjects
