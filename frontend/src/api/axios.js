import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sms_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/auth/login')
    const message = error.response?.data?.message || error.message || 'An error occurred'

    if (error.response?.status === 401) {
      if (!isLoginEndpoint) {
        localStorage.removeItem('sms_token')
        localStorage.removeItem('sms_user')
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    } else if (error.response?.status !== 404 && !isLoginEndpoint) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api
