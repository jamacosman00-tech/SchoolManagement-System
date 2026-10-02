import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { login as loginApi } from '../api/auth'

export const AuthContext = createContext(null)

const DEMO_USERS = {
  'admin@school.com': {
    _id: '1',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@school.com',
    role: 'admin',
    avatar: null,
  },
  'marcus.vance@school.com': {
    _id: '2',
    name: 'Prof. Marcus Vance',
    email: 'marcus.vance@school.com',
    role: 'teacher',
    avatar: null,
  },
  'teacher@school.com': {
    _id: '2',
    name: 'Prof. Marcus Vance',
    email: 'teacher@school.com',
    role: 'teacher',
    avatar: null,
  },
  'student@school.com': {
    _id: '3',
    name: 'Alex Sterling',
    email: 'student@school.com',
    role: 'student',
    avatar: null,
  },
  'parent@school.com': {
    _id: '4',
    name: 'Robert Sterling',
    email: 'parent@school.com',
    role: 'parent',
    avatar: null,
  },
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('sms_token')
    const savedUser = localStorage.getItem('sms_user')
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(parsedUser)
      } catch {
        localStorage.removeItem('sms_token')
        localStorage.removeItem('sms_user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      // 1. Try Live API authentication
      try {
        const response = await loginApi(email, password)
        if (response.data && response.data.token) {
          const { token: newToken, user: newUser } = response.data
          setToken(newToken)
          setUser(newUser)
          localStorage.setItem('sms_token', newToken)
          localStorage.setItem('sms_user', JSON.stringify(newUser))
          setLoading(false)
          return { success: true, role: newUser.role }
        }
      } catch (apiErr) {
        console.warn('Backend API login unavailable or rejected, trying demo accounts:', apiErr.message)
      }

      // 2. Demo fallback authentication
      const normalizedEmail = (email || '').trim().toLowerCase()
      const demoUser = DEMO_USERS[normalizedEmail]

      if (demoUser) {
        const mockToken = 'demo_token_' + Date.now()
        setToken(mockToken)
        setUser(demoUser)
        localStorage.setItem('sms_token', mockToken)
        localStorage.setItem('sms_user', JSON.stringify(demoUser))
        setLoading(false)
        return { success: true, role: demoUser.role }
      }

      throw new Error('Invalid email or password. Please select a demo account or register in the database.')
    } catch (err) {
      setLoading(false)
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('sms_token')
    localStorage.removeItem('sms_user')
    toast.success('Logged out successfully')
  }, [])

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('sms_user', JSON.stringify(updatedUser))
  }, [])

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
