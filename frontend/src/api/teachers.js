import api from './axios'

export const getTeachers = (params) => api.get('/teachers', { params })
export const getTeacherById = (id) => api.get(`/teachers/${id}`)
export const createTeacher = (data) => api.post('/teachers', data)
export const updateTeacher = (id, data) => api.put(`/teachers/${id}`, data)
export const deleteTeacher = (id) => api.delete(`/teachers/${id}`)
export const getTeacherClasses = (id) => api.get(`/teachers/${id}/classes`)
export const getTeacherSubjects = (id) => api.get(`/teachers/${id}/subjects`)
