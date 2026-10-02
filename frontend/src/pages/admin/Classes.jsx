import React, { useState } from 'react'
import { Plus, Users, BookOpen, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { getClasses, createClass, updateClass, deleteClass } from '../../api/classes'
import { getTeachers } from '../../api/teachers'
import { useEffect } from 'react'

const INITIAL_CLASSES = [
  { _id: '1', name: 'Grade 10', section: 'A', teacherName: 'Prof. Marcus Vance', studentCount: 34, subjectCount: 6, academicYear: '2026-2027' },
  { _id: '2', name: 'Grade 10', section: 'B', teacherName: 'Ms. Elena Rodriguez', studentCount: 31, subjectCount: 6, academicYear: '2026-2027' },
  { _id: '3', name: 'Grade 11', section: 'A', teacherName: 'Mr. David Chen', studentCount: 28, subjectCount: 7, academicYear: '2026-2027' },
  { _id: '4', name: 'Grade 11', section: 'B', teacherName: 'Prof. Marcus Vance', studentCount: 29, subjectCount: 7, academicYear: '2026-2027' },
  { _id: '5', name: 'Grade 12', section: 'A', teacherName: 'Ms. Elena Rodriguez', studentCount: 25, subjectCount: 8, academicYear: '2026-2027' },
]

const Classes = () => {
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  useEffect(() => { Promise.all([getClasses(), getTeachers({ limit: 100 })]).then(([c, t]) => { setClasses((c.data.classes || []).map((x) => ({ ...x, teacherName: x.classTeacher?.user?.name || '', studentCount: x.students?.length || 0, subjectCount: 0, teacherId: x.classTeacher?._id || '' }))); setTeachers(t.data.teachers || []) }).catch((e) => toast.error(e.response?.data?.message || 'Could not load classes')) }, [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const [formData, setFormData] = useState({
    name: 'Grade 10',
    section: 'A',
    teacherName: 'Prof. Marcus Vance',
    academicYear: '2026-2027',
  })

  const handleOpenAdd = () => {
    setSelectedClass(null)
    setFormData({ name: 'Grade 10', section: 'C', teacherName: 'Prof. Marcus Vance', academicYear: '2026-2027' })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (c) => {
    setSelectedClass(c)
    setFormData({
      name: c.name,
      section: c.section,
      teacherName: c.teacherName,
      academicYear: c.academicYear,
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try { const classTeacher = teachers.find((t) => (t.user?.name || t.name) === formData.teacherName)?._id || null; const payload = { name: formData.name, section: formData.section, classTeacher, academicYear: formData.academicYear }; if (selectedClass) await updateClass(selectedClass._id, payload); else await createClass(payload); const response = await getClasses(); setClasses((response.data.classes || []).map((x) => ({ ...x, teacherName: x.classTeacher?.user?.name || '', studentCount: x.students?.length || 0, subjectCount: 0 }))); toast.success(selectedClass ? 'Class updated' : 'Class created'); setIsModalOpen(false) } catch (error) { toast.error(error.response?.data?.message || 'Could not save class') }
  }

  const handleDelete = async () => {
    try { await deleteClass(deleteId); setClasses(classes.filter((c) => c._id !== deleteId)); toast.success('Class deleted') } catch (error) { toast.error(error.response?.data?.message || 'Could not delete class') }
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Class & Grade Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure academic cohorts, section divisions, and assigned lead teachers.
          </p>
        </div>
        <Button icon={Plus} onClick={handleOpenAdd}>
          Add Class Section
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((c) => (
          <div
            key={c._id}
            className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                  {c.section}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{c.name}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Section {c.section} • {c.academicYear}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setDeleteId(c._id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Users size={14} className="text-indigo-500" />
                <span>{c.studentCount} Students</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <BookOpen size={14} className="text-emerald-500" />
                <span>{c.subjectCount} Subjects</span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Class Teacher:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{c.teacherName}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedClass ? 'Edit Class Cohort' : 'Create New Class Section'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Grade / Level</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. Grade 10"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Section Code</label>
            <input
              type="text"
              required
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. A"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Assigned Class Teacher</label>
            <input
              type="text"
              value={formData.teacherName}
              onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. Prof. Marcus Vance"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Academic Year</label>
            <input
              type="text"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{selectedClass ? 'Save Changes' : 'Create Class'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Class Section"
        message="Are you sure you want to remove this class? All associated timetables and subject mappings will need reassignment."
      />
    </div>
  )
}

export default Classes
