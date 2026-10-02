import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Users, Mail, Phone, MapPin, Eye, HeartHandshake, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import StatCard from '../../components/ui/StatCard'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { getParents, createParent, updateParent, deleteParent } from '../../api/parents'
import { getStudents } from '../../api/students'

const Parents = () => {
  const [parents, setParents] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedParent, setSelectedParent] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    studentIds: [],
  })

  useEffect(() => {
    loadParents()
    loadStudentsList()
  }, [])

  const loadParents = async () => {
    setLoading(true)
    try {
      const res = await getParents({ limit: 100 })
      setParents(res.data?.parents || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load parents')
    } finally {
      setLoading(false)
    }
  }

  const loadStudentsList = async () => {
    try {
      const res = await getStudents({ limit: 200 })
      setStudents(res.data?.students || [])
    } catch (error) {
      console.warn('Could not load student roster:', error)
    }
  }

  const handleOpenAdd = () => {
    setSelectedParent(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      address: '',
      studentIds: [],
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (p) => {
    setSelectedParent(p)
    const linkedIds = Array.isArray(p.children) ? p.children.map((c) => c._id) : []
    const addr = typeof p.address === 'object' && p.address !== null
      ? [p.address.street, p.address.city, p.address.state].filter(Boolean).join(', ')
      : (p.address || '')

    setFormData({
      name: p.name || '',
      email: p.email || '',
      phone: p.phone || '',
      password: '',
      address: addr,
      studentIds: linkedIds,
    })
    setIsModalOpen(true)
  }

  const handleToggleStudent = (studentId) => {
    setFormData((prev) => {
      const exists = prev.studentIds.includes(studentId)
      return {
        ...prev,
        studentIds: exists
          ? prev.studentIds.filter((id) => id !== studentId)
          : [...prev.studentIds, studentId],
      }
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error('Please enter parent name and email')
      return
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        studentIds: formData.studentIds,
      }
      if (formData.password) payload.password = formData.password

      if (selectedParent) {
        await updateParent(selectedParent._id, payload)
        toast.success('Parent details updated')
      } else {
        await createParent(payload)
        toast.success('Parent account registered')
      }

      await loadParents()
      setIsModalOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not save parent')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteParent(deleteId)
      setParents((curr) => curr.filter((p) => p._id !== deleteId))
      toast.success('Parent removed and unlinked')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove parent')
    }
    setDeleteId(null)
  }

  const filteredParents = parents.filter((p) => {
    const name = p.name || ''
    const email = p.email || ''
    const phone = p.phone || ''
    const childMatch = (p.children || []).some((c) => (c.name || '').toLowerCase().includes(search.toLowerCase()))
    const query = search.toLowerCase()
    return (
      name.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      phone.toLowerCase().includes(query) ||
      childMatch
    )
  })

  const totalChildrenCount = parents.reduce((acc, p) => acc + (p.children?.length || 0), 0)

  const columns = [
    {
      key: 'name',
      label: 'Parent / Guardian',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{row.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Telephone Contact',
      render: (v) => <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{v || '—'}</span>,
    },
    {
      key: 'children',
      label: 'Linked Children',
      render: (v) => {
        const list = Array.isArray(v) ? v : []
        if (list.length === 0) {
          return <span className="text-xs text-gray-400 italic">No linked students</span>
        }
        return (
          <div className="flex flex-wrap gap-1">
            {list.map((ch, idx) => (
              <Badge key={idx} variant="primary">
                {ch.name} ({ch.class || 'Student'})
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      key: 'address',
      label: 'Address',
      render: (v) => {
        const addr = typeof v === 'object' && v !== null
          ? [v.street, v.city].filter(Boolean).join(', ')
          : (v || '—')
        return <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[150px] inline-block">{addr || '—'}</span>
      },
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (v) => (
        <Badge variant={v !== false ? 'success' : 'neutral'}>
          {v !== false ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedParent(row)
              setIsViewOpen(true)
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            title="View Details"
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Parents & Guardians Directory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage guardian accounts, primary contacts, and associated enrolled children.
          </p>
        </div>
        <Button icon={Plus} onClick={handleOpenAdd}>
          Add Parent
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Registered Guardians"
          value={parents.length}
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Linked Children"
          value={totalChildrenCount}
          icon={HeartHandshake}
          variant="success"
        />
        <StatCard
          title="Active Portal Access"
          value={parents.filter((p) => p.isActive !== false).length}
          icon={CheckCircle2}
          variant="warning"
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search parent or child name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </Card>

      {/* Parents Table */}
      <Card>
        <Table columns={columns} data={filteredParents} loading={loading} />
      </Card>

      {/* Add / Edit Parent Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedParent ? 'Edit Guardian Details' : 'Register New Parent / Guardian'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Guardian Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g. Robert Sterling"
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
                placeholder="parent@school.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {selectedParent ? 'Change Password (Optional)' : 'Portal Password'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={selectedParent ? 'Leave blank to keep current' : 'Default: Password@123'}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Residential Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Street, City, State"
              />
            </div>
          </div>

          {/* Link Enrolled Students Section */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Link Enrolled Students (Children)
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl p-2 space-y-1 bg-gray-50 dark:bg-gray-800/50">
              {students.length === 0 ? (
                <p className="text-xs text-gray-400 p-2">No students available</p>
              ) : (
                students.map((st) => {
                  const isChecked = formData.studentIds.includes(st._id)
                  const stName = st.user?.name || st.name
                  const stClass = st.class ? `${st.class.name} - ${st.class.section}` : 'No class'
                  return (
                    <label
                      key={st._id}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition ${
                        isChecked
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleStudent(st._id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{stName}</span>
                      </div>
                      <span className="font-mono text-[11px] text-gray-500">{st.admissionNo} • {stClass}</span>
                    </label>
                  )
                })
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedParent ? 'Save Changes' : 'Register Guardian'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Guardian & Family Profile"
        size="md"
      >
        {selectedParent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
              <Avatar name={selectedParent.name} size="lg" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedParent.name}
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  {selectedParent.email} • {selectedParent.phone || 'No phone'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Linked Enrolled Children ({selectedParent.children?.length || 0})
              </h4>
              <div className="space-y-2">
                {(selectedParent.children || []).length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No student records linked to this guardian.</p>
                ) : (
                  (selectedParent.children || []).map((child) => (
                    <div
                      key={child._id}
                      className="p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{child.name}</div>
                        <div className="text-gray-500">{child.class} • Roll No: {child.rollNo || 'N/A'}</div>
                      </div>
                      <Badge variant="info">{child.admissionNo}</Badge>
                    </div>
                  ))
                )}
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
        title="Remove Guardian Record"
        message="Are you sure you want to remove this parent account? The student records will remain intact with unlinked guardian references."
      />
    </div>
  )
}

export default Parents
