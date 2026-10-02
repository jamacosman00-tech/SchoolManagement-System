import React, { useState, useEffect } from 'react'
import { Plus, Bell, Send, Trash2, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { getAllNotifications, createNotification, deleteNotification } from '../../api/notifications'

const INITIAL_NOTIFICATIONS = [
  { _id: '1', title: 'Spring Semester Midterm Schedule Released', message: 'The comprehensive timetable for Spring 2026 midterm examinations is now published in the portal.', type: 'info', targetRole: 'All Users', createdAt: '2026-04-01', senderName: 'Dr. Sarah Jenkins' },
  { _id: '2', title: 'Annual Science & Tech Fair Registration', message: 'All students are invited to register for the Annual STEM Science Fair by next Friday.', type: 'success', targetRole: 'Students & Parents', createdAt: '2026-03-28', senderName: 'Ms. Elena Rodriguez' },
  { _id: '3', title: 'Parent-Teacher Conference Scheduled', message: 'Individual progress meetings will be conducted next Saturday via hybrid mode.', type: 'warning', targetRole: 'Parents', createdAt: '2026-03-25', senderName: 'Administration' },
]

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const reload = async () => { const { data } = await getAllNotifications(); setNotifications((data.notifications || []).map((n) => ({ ...n, targetRole: n.isGlobal ? 'All Users' : n.targetRole || 'Selected users', senderName: n.sender?.name || '', createdAt: n.createdAt?.slice(0, 10) }))) }
  useEffect(() => { reload().catch((e) => toast.error(e.response?.data?.message || 'Could not load notifications')) }, [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetRole: 'All Users',
    type: 'info',
  })

  const handleSend = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.message) {
      toast.error('Please enter title and message')
      return
    }

    try { const audience = { 'All Users': { isGlobal: true }, Teachers: { targetRole: 'teacher' }, Students: { targetRole: 'student' }, Parents: { targetRole: 'parent' } }[formData.targetRole] || {}; await createNotification({ title: formData.title, message: formData.message, type: formData.type, ...audience }); await reload(); toast.success('Notification sent'); setIsModalOpen(false) } catch (error) { toast.error(error.response?.data?.message || 'Could not send notification') }
  }

  const handleDelete = async () => {
    try { await deleteNotification(deleteId); setNotifications(notifications.filter((n) => n._id !== deleteId)); toast.success('Notification deleted') } catch (error) { toast.error(error.response?.data?.message || 'Could not delete notification') }
    setDeleteId(null)
    toast.success('Notification removed')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements & Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Broadcast emergency alerts, schedules, and memos to faculty, students, and parents.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          New Broadcast
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => (
          <Card key={n._id} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mt-0.5">
                  <Bell size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{n.title}</h3>
                    <Badge variant={n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'info'}>
                      {n.targetRole}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{n.message}</p>
                  <div className="text-xs text-gray-400 font-medium pt-1">
                    Sent by {n.senderName} • {n.createdAt}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDeleteId(n._id)}
                className="self-end sm:self-start p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Compose School Announcement"
        size="md"
      >
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Announcement Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. Midterm Examination Schedule"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="All Users">All Users</option>
                <option value="Teachers">Teachers Only</option>
                <option value="Students">Students Only</option>
                <option value="Parents">Parents Only</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Alert Level</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="info">General Info</option>
                <option value="success">Success / Event</option>
                <option value="warning">Important Alert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Message Content</label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Type message content here..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" icon={Send}>Broadcast Now</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        message="Are you sure you want to delete this broadcast message?"
      />
    </div>
  )
}

export default Notifications
