import api from './axios'

export const markAttendance = (data) => api.post('/attendance/mark', data)
export const getAttendanceByClass = (classId, date) =>
  api.get(`/attendance/class/${classId}`, { params: { date } })
export const getStudentAttendance = (studentId, params) =>
  api.get(`/attendance/student/${studentId}`, { params })
export const getAttendanceSummary = (studentId) =>
  api.get(`/attendance/summary/${studentId}`)
export const updateAttendance = (id, data) => api.put(`/attendance/${id}`, data)
export const deleteAttendance = (id) => api.delete(`/attendance/${id}`)
export const getClassAttendanceSummary = (classId, params) =>
  api.get(`/attendance/class/${classId}/summary`, { params })
