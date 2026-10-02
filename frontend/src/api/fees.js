import api from './axios'

export const getFees = (params) => api.get('/fees', { params })
export const getFeeById = (id) => api.get(`/fees/${id}`)
export const createFee = (data) => api.post('/fees', data)
export const updateFee = (id, data) => api.patch(`/fees/${id}`, data)
export const updateFeeStatus = (id, status) => api.patch(`/fees/${id}`, { status })
export const deleteFee = (id) => api.delete(`/fees/${id}`)
export const getStudentFees = (studentId) => api.get(`/fees/student/${studentId}`)
export const getFeeSummary = (params) => api.get('/fees/summary', { params })
