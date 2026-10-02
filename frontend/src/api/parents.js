import api from './axios'

export const getParents = (params) => api.get('/parents', { params })
export const getParentById = (id) => api.get(`/parents/${id}`)
export const createParent = (data) => api.post('/parents', data)
export const updateParent = (id, data) => api.put(`/parents/${id}`, data)
export const deleteParent = (id) => api.delete(`/parents/${id}`)
