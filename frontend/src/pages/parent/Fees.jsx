import React from 'react'
import { DollarSign, CheckCircle2, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'

const ParentFees = () => {
  const feeRecords = [
    { type: 'Spring Term Tuition Fee', amount: 2500, dueDate: '2026-04-01', paidDate: '2026-03-28', status: 'paid', txn: 'TXN-99101' },
    { type: 'Spring Term Bus Transport', amount: 350, dueDate: '2026-04-01', paidDate: '2026-03-29', status: 'paid', txn: 'TXN-99102' },
    { type: 'Science Lab Supplies Fee', amount: 150, dueDate: '2026-05-01', paidDate: null, status: 'pending', txn: '—' },
  ]

  const handlePay = (type) => {
    toast.success(`Redirecting to secure payment gateway for ${type}...`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Statements & Invoices</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Student: Alex Sterling • Grade 10 - Section A
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Total Paid This Year" value="$2,850" icon={CheckCircle2} variant="success" />
        <StatCard title="Upcoming Balance" value="$150" variant="warning" />
        <StatCard title="Overdue Balance" value="$0.00" variant="primary" />
      </div>

      <Card>
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Fee Particulars</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Due Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Transaction ID</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {feeRecords.map((f, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{f.type}</td>
                  <td className="px-4 py-3 font-mono font-bold">${f.amount}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{f.dueDate}</td>
                  <td className="px-4 py-3">
                    <Badge variant={f.status === 'paid' ? 'success' : 'warning'}>
                      {f.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{f.txn}</td>
                  <td className="px-4 py-3">
                    {f.status === 'paid' ? (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Receipt Available
                      </span>
                    ) : (
                      <Button size="xs" onClick={() => handlePay(f.type)}>Pay Now</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default ParentFees
