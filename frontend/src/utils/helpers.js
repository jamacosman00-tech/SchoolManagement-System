import { GRADE_SCALE } from './constants'

export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  if (isNaN(date)) return 'Invalid Date'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  })
}

export const formatDateInput = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date)) return ''
  return date.toISOString().split('T')[0]
}

export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const getGrade = (marks, maxMarks) => {
  if (maxMarks === 0) return { grade: 'N/A', gpa: 0, percentage: 0 }
  const percentage = (marks / maxMarks) * 100
  const gradeObj = GRADE_SCALE.find(
    (g) => percentage >= g.minPercent && percentage <= g.maxPercent
  )
  return { grade: gradeObj?.grade || 'F', gpa: gradeObj?.gpa || 0, percentage: Math.round(percentage) }
}

export const getAttendanceColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600 dark:text-green-400'
  if (percentage >= 75) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

export const getAttendanceBg = (percentage) => {
  if (percentage >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  if (percentage >= 75) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

export const truncate = (str, len = 50) => {
  if (!str) return ''
  return str.length > len ? str.substring(0, len) + '...' : str
}

export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const generateAdmissionNo = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ADM-${year}-${random}`
}

export const generateEmployeeId = () => {
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `EMP-${random}`
}

export const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    inactive: 'neutral',
    pending: 'warning',
    paid: 'success',
    unpaid: 'error',
    overdue: 'error',
    partial: 'warning',
    present: 'success',
    absent: 'error',
    late: 'warning',
    excused: 'info',
    graded: 'success',
    submitted: 'info',
    upcoming: 'info',
    completed: 'success',
    cancelled: 'error',
  }
  return colors[status?.toLowerCase()] || 'neutral'
}

export const debounce = (fn, delay = 300) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
