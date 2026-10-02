import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, BookMarked,
  ClipboardCheck, FileText, PenSquare, BarChart2, DollarSign,
  Bell, TrendingUp, Settings, CalendarDays, X, ChevronLeft, ChevronRight,
  School, LogOut
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../hooks/useAuth'
import { NAV_ITEMS } from '../utils/constants'
import Avatar from '../components/ui/Avatar'

const iconMap = {
  LayoutDashboard, Users, GraduationCap, BookOpen, BookMarked,
  ClipboardCheck, FileText, PenSquare, BarChart2, DollarSign,
  Bell, TrendingUp, Settings, CalendarDays,
}

const Sidebar = ({ role, collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = NAV_ITEMS[role] || []

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) {
        onMobileClose?.()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileOpen, onMobileClose])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={clsx(
        'flex items-center gap-3 px-4 py-5 border-b border-gray-100 dark:border-gray-700',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/30">
            <School size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                SchoolManage
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pro</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        {collapsed && (
          <button
            onClick={onToggle}
            className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                clsx(
                  'sidebar-link',
                  isActive ? 'active' : '',
                  collapsed && 'justify-center px-2'
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* User Info */}
      <div className={clsx(
        'border-t border-gray-100 dark:border-gray-700 p-3',
        collapsed ? 'flex flex-col items-center gap-2' : ''
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <Avatar name={user?.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        )}
        {collapsed && <Avatar name={user?.name} size="sm" />}
        <button
          onClick={handleLogout}
          className={clsx(
            'flex items-center gap-2 w-full px-3 py-2 rounded-lg',
            'text-sm font-medium text-red-500 dark:text-red-400',
            'hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 shadow-2xl',
          'transform transition-transform duration-300 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={onMobileClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={18} />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          'hidden lg:flex flex-col h-screen sticky top-0',
          'bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700',
          'transition-all duration-300 ease-in-out flex-shrink-0',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

export default Sidebar
