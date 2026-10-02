import api from './axios'

export const getAssignments = (params) => api.get('/assignments', { params })
export const getAssignmentById = (id) => api.get(`/assignments/${id}`)
export const createAssignment = (data) => api.post('/assignments', data)
export const updateAssignment = (id, data) => api.put(`/assignments/${id}`, data)
export const deleteAssignment = (id) => api.delete(`/assignments/${id}`)
export const submitAssignment = (id, data) => api.post(`/assignments/${id}/submit`, data)
export const gradeSubmission = (id, studentId, data) =>
  api.put(`/assignments/${id}/grade/${studentId}`, data)
export const getSubmissions = (id) => api.get(`/assignments/${id}/submissions`)
