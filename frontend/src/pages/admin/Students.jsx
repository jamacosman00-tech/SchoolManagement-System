import React, { useState, useEffect } from 'react'
import { Plus, Search, Eye, Edit2, Trash2, Users, Download, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../api/students'
import { getClasses } from '../../api/classes'

const INITIAL_STUDENTS = [
  { _id: '1', admissionNo: 'ADM-2026-001', user: { name: 'Alex Sterling', email: 'student@school.com' }, class: { name: 'Grade 10', section: 'A' }, rollNo: '10A-01', parentName: 'Robert Sterling', parentPhone: '+1 555-888-0001', gender: 'Male', status: 'Active' },
  { _id: '2', admissionNo: 'ADM-2026-002', user: { name: 'Emma Garcia', email: 'emma.garcia@school.com' }, class: { name: 'Grade 10', section: 'A' }, rollNo: '10A-02', parentName: 'Maria Garcia', parentPhone: '+1 555-888-0002', gender: 'Female', status: 'Active' },
  { _id: '3', admissionNo: 'ADM-2026-003', user: { name: 'Liam Johnson', email: 'liam.johnson@school.com' }, class: { name: 'Grade 10', section: 'A' }, rollNo: '10A-03', parentName: 'Mark Johnson', parentPhone: '+1 555-444-0003', gender: 'Male', status: 'Active' },
  { _id: '4', admissionNo: 'ADM-2026-004', user: { name: 'Sophia Williams', email: 'sophia.williams@school.com' }, class: { name: 'Grade 10', section: 'B' }, rollNo: '10B-01', parentName: 'Claire Williams', parentPhone: '+1 555-444-0004', gender: 'Female', status: 'Active' },
  { _id: '5', admissionNo: 'ADM-2026-005', user: { name: 'Noah Brown', email: 'noah.brown@school.com' }, class: { name: 'Grade 11', section: 'A' }, rollNo: '11A-01', parentName: 'David Brown', parentPhone: '+1 555-444-0005', gender: 'Male', status: 'Active' },
]

const Students = () => {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    admissionNo: '',
    className: 'Grade 10',
    section: 'A',
    rollNo: '',
    dateOfBirth: '',
    parentName: '',
    parentPhone: '',
    gender: 'Male',
  })

  useEffect(() => {
    loadStudents()
    getClasses().then((res) => setClasses(res.data?.classes || [])).catch(() => toast.error('Could not load classes'))
  }, [])

  const loadStudents = async () => {
    setLoading(true)
    try {
      const res = await getStudents()
      setStudents(res.data?.students || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load students')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setSelectedStudent(null)
    setFormData({
      name: '',
      email: '',
      admissionNo: `ADM-2026-00${students.length + 1}`,
      className: 'Grade 10',
      section: 'A',
      rollNo: `10A-0${students.length + 1}`,
      dateOfBirth: '',
      parentName: '',
      parentPhone: '',
      gender: 'Male',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (st) => {
    setSelectedStudent(st)
    setFormData({
      name: st.user?.name || st.name || '',
      email: st.user?.email || st.email || '',
      admissionNo: st.admissionNo || '',
      className: st.class?.name || 'Grade 10',
      section: st.class?.section || 'A',
      rollNo: st.rollNo || '',
      dateOfBirth: st.dateOfBirth?.slice(0, 10) || '',
      parentName: st.parentName || '',
      parentPhone: st.parentPhone || '',
      gender: st.gender || 'Male',
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error('Please enter name and email')
      return
    }

    try {
      const classMatch = classes.find((item) => item.name === formData.className && item.section === formData.section)
      if (!classMatch) throw new Error('Create the selected class before assigning a student')
      const payload = { name: formData.name, email: formData.email, admissionNo: formData.admissionNo, classId: classMatch._id, rollNo: formData.rollNo, dateOfBirth: formData.dateOfBirth, parentName: formData.parentName, parentPhone: formData.parentPhone, gender: String(formData.gender).toLowerCase() }
      if (selectedStudent) await updateStudent(selectedStudent._id, payload)
      else await createStudent(payload)
      await loadStudents()
      toast.success(selectedStudent ? 'Student record updated' : 'Student registered')
      setIsModalOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not save student')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteStudent(deleteId)
      setStudents(students.filter((s) => s._id !== deleteId))
      toast.success('Student removed')
    } catch (error) { toast.error(error.response?.data?.message || 'Could not remove student') }
    setDeleteId(null)
  }

  const filteredStudents = students.filter((s) => {
    const name = s.user?.name || s.name || ''
    const adm = s.admissionNo || ''
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || adm.toLowerCase().includes(search.toLowerCase())
    const matchClass = selectedClass === 'all' || s.class?.name === selectedClass
    return matchSearch && matchClass
  })

  const columns = [
    {
      key: 'user',
      label: 'Student Name',
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
      key: 'admissionNo',
      label: 'Admission No',
      render: (v) => <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{v}</span>,
    },
    {
      key: 'class',
      label: 'Class & Section',
      render: (_, row) => (
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {row.class?.name} - {row.class?.section}
        </span>
      ),
    },
    {
      key: 'rollNo',
      label: 'Roll No',
      render: (v) => <span className="text-xs text-gray-600 dark:text-gray-400">{v || '—'}</span>,
    },
    {
      key: 'parentName',
      label: 'Guardian Contact',
      render: (_, row) => (
        <div>
          <div className="text-sm text-gray-900 dark:text-gray-100">{row.parentName || 'N/A'}</div>
          <div className="text-xs text-gray-500">{row.parentPhone || '—'}</div>
        </div>
      ),
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
            onClick={() => { setSelectedStudent(row); setIsViewOpen(true) }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            title="View Profile"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Directory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage student registrations, academic classes, and guardian records.
          </p>
        </div>
        <Button icon={Plus} onClick={handleOpenAdd}>
          Register Student
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or admission no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Grades</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Students Table */}
      <Card>
        <Table columns={columns} data={filteredStudents} loading={loading} />
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStudent ? 'Edit Student Details' : 'Register New Student'}
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
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Admission Number</label>
              <input
                type="text"
                required
                value={formData.admissionNo}
                onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Roll Number</label>
              <input
                type="text"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
              <input type="date" required value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Gender</label>
              <select value={String(formData.gender).toLowerCase()} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
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
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Section</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Guardian Name</label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Guardian Phone</label>
              <input
                type="text"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedStudent ? 'Save Changes' : 'Register Student'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Student Profile Card"
        size="md"
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
              <Avatar name={selectedStudent.user?.name || selectedStudent.name} size="lg" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedStudent.user?.name || selectedStudent.name}
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  {selectedStudent.admissionNo} • {selectedStudent.class?.name} - {selectedStudent.class?.section}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400">Email Address</span>
                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.user?.email || selectedStudent.email}</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400">Roll Number</span>
                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.rollNo || 'N/A'}</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400">Guardian Name</span>
                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.parentName || 'N/A'}</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400">Guardian Contact</span>
                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.parentPhone || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Student Record"
        message="Are you sure you want to delete this student? All associated attendance and academic records will be archived."
      />
    </div>
  )
}

export default Students
