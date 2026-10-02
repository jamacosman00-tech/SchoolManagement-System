import api from './axios'

export const getStudents = (params) => api.get('/students', { params })
export const getStudentById = (id) => api.get(`/students/${id}`)
export const createStudent = (data) => api.post('/students', data)
export const updateStudent = (id, data) => api.put(`/students/${id}`, data)
export const deleteStudent = (id) => api.delete(`/students/${id}`)
export const getStudentAttendanceSummary = (id) => api.get(`/students/${id}/attendance-summary`)
export const getStudentResults = (id) => api.get(`/students/${id}/results`)
export const getStudentFees = (id) => api.get(`/students/${id}/fees`)
