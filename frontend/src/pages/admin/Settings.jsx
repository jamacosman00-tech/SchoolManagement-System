import React, { useState, useEffect } from 'react'
import { Save, School, Shield, User, Bell, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import { updateProfile, changePassword } from '../../api/auth'

const Settings = () => {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)

  const [schoolInfo, setSchoolInfo] = useState(() => {
    const saved = localStorage.getItem('sms_school_info')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // fallback
      }
    }
    return {
      name: 'Metropolis International Academy',
      code: 'MIA-90210',
      email: 'contact@metropolis-academy.edu',
      phone: '+1 (555) 902-1000',
      address: '100 School Lane, Metropolis City, NY 10001',
      academicYear: '2026-2027',
      term: 'Spring 2026',
    }
  })

  const [profileInfo, setProfileInfo] = useState({
    name: user?.name || 'Dr. Sarah Jenkins',
    email: user?.email || 'admin@school.com',
    phone: user?.phone || '+1 (555) 019-2834',
  })

  useEffect(() => {
    if (user) {
      setProfileInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '+1 (555) 019-2834',
      })
    }
  }, [user])

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSaveSchool = (e) => {
    e.preventDefault()
    localStorage.setItem('sms_school_info', JSON.stringify(schoolInfo))
    toast.success('School configuration updated successfully!')
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoadingProfile(true)
    try {
      const { data } = await updateProfile(profileInfo)
      updateUser(data.user)
      toast.success('Account profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleSavePassword = async (e) => {
    e.preventDefault()
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordInfo.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    setLoadingPassword(true)
    try {
      await changePassword({
        currentPassword: passwordInfo.currentPassword,
        newPassword: passwordInfo.newPassword,
      })

      toast.success('Password changed successfully!')
      setPasswordInfo({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoadingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin & System Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Update your Admin name, email, credentials, and configure institutional preferences.
        </p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
        {[
          { id: 'profile', label: 'Admin Profile', icon: User },
          { id: 'security', label: 'Change Password', icon: Lock },
          { id: 'school', label: 'School Info', icon: School },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'profile' && (
        <Card title="Admin Account Profile" subtitle="Change your administrator display name, official email, and phone contact.">
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Admin Full Name</label>
                <input
                  type="text"
                  required
                  value={profileInfo.name}
                  onChange={(e) => setProfileInfo({ ...profileInfo, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Admin Login Email</label>
                <input
                  type="email"
                  required
                  value={profileInfo.email}
                  onChange={(e) => setProfileInfo({ ...profileInfo, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Telephone Contact</label>
                <input
                  type="text"
                  value={profileInfo.phone}
                  onChange={(e) => setProfileInfo({ ...profileInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">System Role</label>
                <input
                  type="text"
                  disabled
                  value="Administrator (Superuser)"
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" icon={Save} loading={loadingProfile}>Save Profile Changes</Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card title="Change Administrator Password" subtitle="Update your password to keep your administrator account secure.">
          <form onSubmit={handleSavePassword} className="space-y-4 pt-2 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwordInfo.currentPassword}
                onChange={(e) => setPasswordInfo({ ...passwordInfo, currentPassword: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                required
                value={passwordInfo.newPassword}
                onChange={(e) => setPasswordInfo({ ...passwordInfo, newPassword: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter new password (min 6 chars)"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordInfo.confirmPassword}
                onChange={(e) => setPasswordInfo({ ...passwordInfo, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Re-type new password"
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" icon={Save} loading={loadingPassword}>Save New Password</Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'school' && (
        <Card title="Institutional Configuration" subtitle="General school academy profile and calendar.">
          <form onSubmit={handleSaveSchool} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">School / Academy Name</label>
                <input
                  type="text"
                  value={schoolInfo.name}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Institutional Code</label>
                <input
                  type="text"
                  value={schoolInfo.code}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, code: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Official Contact Email</label>
                <input
                  type="email"
                  value={schoolInfo.email}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Official Telephone</label>
                <input
                  type="text"
                  value={schoolInfo.phone}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Campus Physical Address</label>
                <input
                  type="text"
                  value={schoolInfo.address}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Current Academic Year</label>
                <input
                  type="text"
                  value={schoolInfo.academicYear}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, academicYear: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Active Term</label>
                <input
                  type="text"
                  value={schoolInfo.term}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, term: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" icon={Save}>Save Configuration</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}

export default Settings
