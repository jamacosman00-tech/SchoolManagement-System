import api from './axios'

export const getMyNotifications = () => api.get('/notifications/my')
export const getAllNotifications = (params) => api.get('/notifications', { params })
export const markAsRead = (id) => api.patch(`/notifications/${id}/read`)
export const markAllAsRead = () => api.patch('/notifications/read-all')
export const createNotification = (data) => api.post('/notifications', data)
export const deleteNotification = (id) => api.delete(`/notifications/${id}`)
export const getUnreadCount = () => api.get('/notifications/unread-count')
