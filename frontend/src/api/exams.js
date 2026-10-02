import api from './axios'

export const getExams = (params) => api.get('/exams', { params })
export const getExamById = (id) => api.get(`/exams/${id}`)
export const createExam = (data) => api.post('/exams', data)
export const updateExam = (id, data) => api.put(`/exams/${id}`, data)
export const deleteExam = (id) => api.delete(`/exams/${id}`)
export const getExamResults = (id) => api.get(`/exam-results/exam/${id}`)
export const enterResults = (id, results) => api.post('/exam-results/enter', { examId: id, results })
export const updateResult = (id, data) => api.put(`/exam-results/${id}`, data)
export const deleteResult = (id) => api.delete(`/exam-results/${id}`)
