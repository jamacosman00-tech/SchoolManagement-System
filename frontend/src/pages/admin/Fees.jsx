import React, { useState, useEffect } from 'react'
import { Plus, DollarSign, CheckCircle2, AlertCircle, Clock, Search, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { getFees, createFee, updateFeeStatus, deleteFee } from '../../api/fees'
import { getStudents } from '../../api/students'

const INITIAL_FEES = [
  { _id: '1', studentName: 'Alex Sterling', admissionNo: 'ADM-2026-001', feeType: 'Tuition Fee', amount: 2500, dueDate: '2026-04-01', paidDate: '2026-03-28', status: 'paid', paymentMethod: 'Credit Card', transactionId: 'TXN-99101' },
  { _id: '2', studentName: 'Alex Sterling', admissionNo: 'ADM-2026-001', feeType: 'Transport Fee', amount: 350, dueDate: '2026-04-01', paidDate: '2026-03-29', status: 'paid', paymentMethod: 'Direct Debit', transactionId: 'TXN-99102' },
  { _id: '3', studentName: 'Emma Garcia', admissionNo: 'ADM-2026-002', feeType: 'Tuition Fee', amount: 2500, dueDate: '2026-04-01', paidDate: '2026-03-30', status: 'paid', paymentMethod: 'Bank Transfer', transactionId: 'TXN-99103' },
  { _id: '4', studentName: 'Liam Johnson', admissionNo: 'ADM-2026-003', feeType: 'Tuition Fee', amount: 2500, dueDate: '2026-04-01', paidDate: null, status: 'pending', paymentMethod: 'â€”', transactionId: 'â€”' },
  { _id: '5', studentName: 'Sophia Williams', admissionNo: 'ADM-2026-004', feeType: 'Tuition Fee', amount: 2500, dueDate: '2026-03-15', paidDate: null, status: 'overdue', paymentMethod: 'â€”', transactionId: 'â€”' },
]

const Fees = () => {
  const [fees, setFees] = useState([])
  const [students, setStudents] = useState([])
  const reload = async () => { const { data } = await getFees({ limit: 100 }); setFees((data.fees || []).map((f) => ({ ...f, studentName: f.student?.user?.name || '', admissionNo: f.student?.admissionNo || '', amount: Number(f.amount), dueDate: f.dueDate?.slice(0, 10), paidDate: f.paidDate?.slice(0, 10) || null, feeType: `${f.feeType[0].toUpperCase()}${f.feeType.slice(1)} Fee` }))) }
  useEffect(() => { Promise.all([reload(), getStudents({ limit: 100 }).then((r) => setStudents(r.data.students || []))]).catch((e) => toast.error(e.response?.data?.message || 'Could not load fees')) }, [])
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [formData, setFormData] = useState({
    studentName: 'Alex Sterling',
    admissionNo: 'ADM-2026-001',
    feeType: 'Tuition Fee',
    amount: 2500,
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  })

  const handleOpenAdd = () => {
    setFormData({
      studentName: students[0]?.user?.name || 'Alex Sterling',
      admissionNo: students[0]?.admissionNo || 'ADM-2026-001',
      feeType: 'Tuition Fee',
      amount: 2500,
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try { const student = students.find((s) => s.user?.name === formData.studentName || s.admissionNo === formData.admissionNo); if (!student) throw new Error('Student was not found'); const feeType = formData.feeType.toLowerCase().replace(/ fee$/, ''); await createFee({ studentId: student._id, feeType, amount: Number(formData.amount), dueDate: formData.dueDate, academicYear: '2026-2027' }); await reload(); toast.success('Fee voucher saved'); setIsModalOpen(false) } catch (error) { toast.error(error.response?.data?.message || error.message || 'Could not create fee') }
  }

  const toggleStatus = async (id) => {
    const feeRecord = fees.find((f) => f._id === id)
    try {
      await updateFeeStatus(id, feeRecord.status === 'paid' ? 'pending' : 'paid')
      await reload()
      toast.success('Fee status saved')
    } catch (error) { toast.error(error.response?.data?.message || 'Could not update fee') }
  }

  const removeFee = async (id) => { try { await deleteFee(id); setFees((current) => current.filter((fee) => fee._id !== id)); toast.success('Fee record deleted') } catch (error) { toast.error(error.response?.data?.message || 'Could not delete fee') } }


  const totalCollected = fees.filter((f) => f.status === 'paid').reduce((a, b) => a + b.amount, 0)
  const totalPending = fees.filter((f) => f.status === 'pending').reduce((a, b) => a + b.amount, 0)
  const totalOverdue = fees.filter((f) => f.status === 'overdue').reduce((a, b) => a + b.amount, 0)

  const filteredFees = fees.filter((f) => {
    const matchSearch = f.studentName.toLowerCase().includes(search.toLowerCase()) || f.admissionNo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || f.status === statusFilter
    return matchSearch && matchStatus
  })

  const columns = [
    {
      key: 'studentName',
      label: 'Student',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{row.studentName}</div>
          <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{row.admissionNo}</div>
        </div>
      ),
    },
    {
      key: 'feeType',
      label: 'Fee Type',
      render: (v) => <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{v}</span>,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (v) => <span className="font-bold text-gray-900 dark:text-white">${v.toLocaleString()}</span>,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (v) => <span className="text-xs text-gray-600 dark:text-gray-300 font-mono">{v}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => (
        <Badge variant={v === 'paid' ? 'success' : v === 'overdue' ? 'error' : 'warning'}>
          {v.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'transactionId',
      label: 'Transaction ID',
      render: (v) => <span className="text-xs font-mono text-gray-400">{v}</span>,
    },
    {
      key: 'actions',
      label: 'Payment Action',
      render: (_, row) => (
        <div className="flex gap-2"><Button size="xs" variant={row.status === 'paid' ? 'outline' : 'success'} onClick={() => toggleStatus(row._id)}>{row.status === 'paid' ? 'Mark Pending' : 'Mark as Paid'}</Button><Button size="xs" variant="danger" onClick={() => removeFee(row._id)}><Trash2 size={13} /></Button></div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Management & Billing</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track tuition fee invoices, payment reconciliations, and overdue balances.
          </p>
        </div>
        <Button icon={Plus} onClick={handleOpenAdd}>
          Generate Fee Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Total Collected" value={`$${totalCollected.toLocaleString()}`} icon={CheckCircle2} variant="success" />
        <StatCard title="Pending Invoices" value={`$${totalPending.toLocaleString()}`} icon={Clock} variant="warning" />
        <StatCard title="Overdue Balance" value={`$${totalOverdue.toLocaleString()}`} icon={AlertCircle} variant="danger" />
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by student or invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Invoices</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <Table columns={columns} data={filteredFees} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue Fee Invoice"
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Student Name</label>
            <input
              type="text"
              required
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
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
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Fee Category</label>
            <select
              value={formData.feeType}
              onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Tuition Fee">Tuition Fee</option>
              <option value="Transport Fee">Transport Fee</option>
              <option value="Lab Fee">Lab Fee</option>
              <option value="Library Fee">Library Fee</option>
              <option value="Examination Fee">Examination Fee</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Amount ($)</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
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
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Invoice</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Fees
