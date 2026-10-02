import React, { useEffect, useState } from 'react'
import { Edit2, Plus, Search, Trash2, Users as UsersIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Table from '../../components/ui/Table'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { createUser, deleteUser, getUsers, updateUser } from '../../api/users'

const EMPTY_FORM = { name: '', email: '', phone: '', role: 'parent', password: '', gender: 'other', dateOfBirth: '' }

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [editing, setEditing] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const { data } = await getUsers({ limit: 100, search, role: roleFilter || undefined })
      setUsers(data.users || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [search, roleFilter])

  const openEdit = (user) => {
    setEditing(user)
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'parent',
      password: '',
      gender: 'other',
      dateOfBirth: '',
    })
    setIsCreateOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setIsCreateOpen(true)
  }

  const closeModal = () => { setEditing(null); setIsCreateOpen(false) }

  const saveUser = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const { data } = await updateUser(editing._id, form)
        setUsers((prev) => prev.map((u) => u._id === data.user._id ? data.user : u))
        closeModal()
        const profileMsg = data.profile ? ` ${form.role} profile also created.` : ''
        toast.success(`User updated.${profileMsg}`)
      } else {
        const { data } = await createUser(form)
        setUsers((prev) => [data.user, ...prev])
        closeModal()
        const profileMsg = data.profile ? ` ${form.role} profile created automatically.` : ''
        toast.success(`User created.${profileMsg}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save user')
    } finally {
      setSaving(false)
    }
  }

  const removeUser = async () => {
    try {
      await deleteUser(deleteTarget._id)
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id))
      toast.success('User removed')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove user')
    } finally {
      setDeleteTarget(null)
    }
  }

  const field = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (_, user) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
          value === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
          value === 'teacher' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          value === 'student' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
        }`}>{value}</span>
      ),
    },
    { key: 'phone', label: 'Phone', render: (v) => v || '—' },
    {
      key: 'isActive',
      label: 'Status',
      render: (active) => (
        <span className={`text-sm font-medium ${active ? 'text-green-600' : 'text-gray-400'}`}>
          {active ? '● Active' : '○ Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, user) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openEdit(user)}>
            <Edit2 size={14} /> Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteTarget(user)}>
            <Trash2 size={14} /> Remove
          </Button>
        </div>
      ),
    },
  ]

  const isStudent = form.role === 'student'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500">Manage school accounts and roles</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm text-gray-500">
            <UsersIcon size={18} /> {users.length} shown
          </span>
          <Button onClick={openCreate}>
            <Plus size={16} /> Add user
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="min-w-[220px] flex-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email"
              icon={Search}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All roles</option>
            {['admin', 'teacher', 'student', 'parent'].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <Table columns={columns} data={users} loading={loading} emptyMessage="No users found" />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={closeModal}
        title={editing ? 'Edit user' : 'Add user'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={saveUser} loading={saving}>
              {editing ? 'Save changes' : 'Create user'}
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={saveUser}>
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => field('name', e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => field('email', e.target.value)}
            required
          />
          <Input
            label="Phone (optional)"
            value={form.phone}
            onChange={(e) => field('phone', e.target.value)}
          />

          {/* Role selector */}
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
            <select
              value={form.role}
              onChange={(e) => field('role', e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {['admin', 'teacher', 'student', 'parent'].map((r) => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </label>

          {/* Extra fields for student role */}
          {isStudent && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950 space-y-3">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                Student profile details
              </p>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender
                <select
                  value={form.gender}
                  onChange={(e) => field('gender', e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other / Prefer not to say</option>
                </select>
              </label>
              <Input
                label="Date of birth (optional)"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => field('dateOfBirth', e.target.value)}
              />
              <p className="text-xs text-blue-600 dark:text-blue-400">
                An admission number and student profile will be created automatically. You can update more details from the Students page.
              </p>
            </div>
          )}

          {form.role === 'teacher' && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 dark:border-indigo-800 dark:bg-indigo-950">
              <p className="text-xs text-indigo-700 dark:text-indigo-300">
                An employee ID and teacher profile will be created automatically. You can add subjects and classes from the Teachers page.
              </p>
            </div>
          )}

          {/* Password — only on create */}
          {!editing && (
            <Input
              label="Initial password"
              type="password"
              value={form.password}
              onChange={(e) => field('password', e.target.value)}
              required
            />
          )}
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={removeUser}
        title="Remove user"
        message={`Remove ${deleteTarget?.name || 'this user'}? Their account${
          deleteTarget?.role === 'student' ? ' and student profile' :
          deleteTarget?.role === 'teacher' ? ' and teacher profile' : ''
        } will be permanently deleted.`}
        confirmText="Remove"
      />
    </div>
  )
}

export default Users
