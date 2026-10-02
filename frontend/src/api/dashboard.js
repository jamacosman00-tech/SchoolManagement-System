import api from './axios'

export const getAdminDashboard = () => api.get('/dashboard/admin')
export const getTeacherDashboard = () => api.get('/dashboard/teacher')
export const getStudentDashboard = () => api.get('/dashboard/student')
export const getParentDashboard = () => api.get('/dashboard/parent')
