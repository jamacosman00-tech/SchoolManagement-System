import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, Sun, Moon, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import Avatar from '../components/ui/Avatar'

const getPageTitle = (pathname) => {
  const parts = pathname.split('/').filter(Boolean)
  const last = parts[parts.length - 1]
  if (!last) return 'Dashboard'
  return last
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const Navbar = ({ onMobileMenuOpen, onSidebarToggle, sidebarCollapsed }) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const dropdownRef = useRef(null)
  const notifRef = useRef(null)

  const title = getPageTitle(location.pathname)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
    navigate('/login')
  }

  const mockNotifications = [
    { id: 1, title: 'New student registered', time: '2m ago', read: false },
    { id: 2, title: 'Fee payment received', time: '1h ago', read: false },
    { id: 3, title: 'Exam schedule published', time: '3h ago', read: true },
  ]

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  const handleGoToSettings = () => {
    setDropdownOpen(false)
    if (user?.role === 'admin') {
      navigate('/admin/settings')
    }
  }

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <Menu size={20} />
        </button>

        <h2 className="text-base font-semibold text-gray-900 dark:text-white hidden sm:block">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 flex items-center justify-center bg-red-500 text-white rounded-full text-xs font-bold leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-700 max-h-64 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={clsx(
                      'px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer',
                      !n.read && 'bg-primary-50/50 dark:bg-primary-900/10'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && (
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                      )}
                      <div className={!n.read ? '' : 'ml-4'}>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{n.title}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => {
                    setNotifOpen(false)
                    navigate(`/${user?.role}/notifications` || '/admin/notifications')
                  }}
                  className="w-full text-xs text-center text-primary-600 dark:text-primary-400 py-1 hover:underline"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Avatar name={user?.name} size="sm" />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize leading-tight">
                {user?.role}
              </p>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={handleGoToSettings}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <User size={15} />
                  Profile
                </button>
                <button
                  onClick={handleGoToSettings}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings size={15} />
                  Settings
                </button>
                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
