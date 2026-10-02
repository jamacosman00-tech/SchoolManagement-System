import React, { useState, useEffect } from 'react'
import { Calendar, CheckCircle2, XCircle, Clock, Save, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import { getClasses, getClassById } from '../../api/classes'
import { getAttendanceByClass, markAttendance } from '../../api/attendance'

const INITIAL_ROSTER = [
  { id: '1', name: 'Alex Sterling', rollNo: '10A-01', status: 'present' },
  { id: '2', name: 'Emma Garcia', rollNo: '10A-02', status: 'present' },
  { id: '3', name: 'Liam Johnson', rollNo: '10A-03', status: 'present' },
  { id: '4', name: 'Sophia Williams', rollNo: '10A-04', status: 'late' },
  { id: '5', name: 'Noah Brown', rollNo: '10A-05', status: 'absent' },
  { id: '6', name: 'Lucas Taylor', rollNo: '10A-06', status: 'present' },
  { id: '7', name: 'Ava Anderson', rollNo: '10A-07', status: 'present' },
  { id: '8', name: 'Ethan Thomas', rollNo: '10A-08', status: 'present' },
]

const Attendance = () => {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [roster, setRoster] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => { getClasses().then(({ data }) => { const items = data.classes || []; setClasses(items); if (items[0]) setSelectedClass(items[0]._id) }).catch((e) => toast.error(e.response?.data?.message || 'Could not load classes')) }, [])
  useEffect(() => { if (!selectedClass) return; Promise.all([getClassById(selectedClass), getAttendanceByClass(selectedClass, selectedDate)]).then(([classRes, attendanceRes]) => { const existing = new Map((attendanceRes.data.attendance || []).map((item) => [item.student?._id, item])); setRoster((classRes.data.class?.students || []).map((student) => { const saved = existing.get(student._id); return { id: student._id, name: student.user?.name || 'Student', rollNo: student.rollNo || '', status: saved?.status || 'present', remarks: saved?.remarks || '' } })) }).catch((e) => toast.error(e.response?.data?.message || 'Could not load attendance')) }, [selectedClass, selectedDate])

  const handleStatusChange = (studentId, newStatus) => {
    setRoster(roster.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s)))
  }

  const markAll = (status) => {
    setRoster(roster.map((s) => ({ ...s, status })))
    toast.success(`Marked all students as ${status}`)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try { await markAttendance({ classId: selectedClass, date: selectedDate, records: roster.map((item) => ({ studentId: item.id, status: item.status, remarks: item.remarks })) }); toast.success('Attendance saved to database') } catch (error) { toast.error(error.response?.data?.message || 'Could not save attendance') } finally { setIsSaving(false) }
  }

  const presentCount = roster.filter((s) => s.status === 'present').length
  const absentCount = roster.filter((s) => s.status === 'absent').length
  const lateCount = roster.filter((s) => s.status === 'late').length
  const attendanceRate = ((presentCount + lateCount) / roster.length * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Attendance Register</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Log daily student presence, punctuality, and calculate real-time cohort statistics.
          </p>
        </div>
        <Button icon={Save} loading={isSaving} onClick={handleSave}>
          Save Attendance
        </Button>
      </div>

      {/* Filter and stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {classes.map((item) => <option key={item._id} value={item._id}>{item.name} - Section {item.section}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">Daily Attendance Rate</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{attendanceRate}%</div>
          </div>
          <Badge variant="success">Good</Badge>
        </Card>

        <Card className="flex items-center justify-around text-center">
          <div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">Present</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{presentCount}</span>
          </div>
          <div className="border-l border-r border-gray-100 dark:border-gray-700 px-3">
            <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold block">Absent</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{absentCount}</span>
          </div>
          <div>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold block">Late</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{lateCount}</span>
          </div>
        </Card>
      </div>

      {/* Roster list */}
      <Card>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white">Class Roll Call</h3>
          <div className="flex gap-2">
            <button
              onClick={() => markAll('present')}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium hover:bg-emerald-100 transition"
            >
              All Present
            </button>
            <button
              onClick={() => markAll('absent')}
              className="text-xs px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-medium hover:bg-rose-100 transition"
            >
              All Absent
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700 mt-2">
          {roster.map((student) => (
            <div key={student.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={student.name} size="sm" />
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">{student.name}</div>
                  <div className="text-xs text-gray-400">Roll: {student.rollNo}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleStatusChange(student.id, 'present')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    student.status === 'present'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                  }`}
                >
                  <CheckCircle2 size={14} /> Present
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(student.id, 'late')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    student.status === 'late'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                  }`}
                >
                  <Clock size={14} /> Late
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(student.id, 'absent')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    student.status === 'absent'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                  }`}
                >
                  <XCircle size={14} /> Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Attendance
