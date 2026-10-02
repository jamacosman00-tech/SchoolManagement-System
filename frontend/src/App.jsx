import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { PrivateRoute, RoleRoute } from './routes/PrivateRoute'
import AppLayout from './layouts/AppLayout'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminStudents from './pages/admin/Students'
import AdminTeachers from './pages/admin/Teachers'
import AdminClasses from './pages/admin/Classes'
import AdminSubjects from './pages/admin/Subjects'
import AdminAttendance from './pages/admin/Attendance'
import AdminAssignments from './pages/admin/Assignments'
import AdminExams from './pages/admin/Exams'
import AdminExamResults from './pages/admin/ExamResults'
import AdminFees from './pages/admin/Fees'
import AdminNotifications from './pages/admin/Notifications'
import AdminReports from './pages/admin/Reports'
import AdminSettings from './pages/admin/Settings'
import AdminUsers from './pages/admin/Users'
import AdminParents from './pages/admin/Parents'

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherMyClasses from './pages/teacher/MyClasses'
import TeacherAttendance from './pages/teacher/Attendance'
import TeacherAssignments from './pages/teacher/Assignments'
import TeacherExams from './pages/teacher/Exams'
import TeacherGrades from './pages/teacher/Grades'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import StudentSubjects from './pages/student/Subjects'
import StudentTimetable from './pages/student/Timetable'
import StudentAttendance from './pages/student/Attendance'
import StudentAssignments from './pages/student/Assignments'
import StudentExams from './pages/student/Exams'
import StudentResults from './pages/student/Results'
import StudentNotifications from './pages/student/Notifications'

// Parent Pages
import ParentDashboard from './pages/parent/Dashboard'
import ParentChildren from './pages/parent/Children'
import ParentAttendance from './pages/parent/Attendance'
import ParentPerformance from './pages/parent/Performance'
import ParentFees from './pages/parent/Fees'
import ParentNotifications from './pages/parent/Notifications'

// Root redirect handler based on authenticated role
const RootRedirect = () => {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />

  const paths = {
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
    parent: '/parent/dashboard',
  }
  return <Navigate to={paths[user?.role] || '/login'} replace />
}

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Root Path Redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        {/* Admin Routes */}
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AppLayout role="admin" />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="classes" element={<AdminClasses />} />
            <Route path="subjects" element={<AdminSubjects />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="assignments" element={<AdminAssignments />} />
            <Route path="exams" element={<AdminExams />} />
            <Route path="results" element={<AdminExamResults />} />
            <Route path="fees" element={<AdminFees />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="parents" element={<AdminParents />} />
          </Route>
        </Route>

        {/* Teacher Routes */}
        <Route element={<RoleRoute allowedRoles={['teacher']} />}>
          <Route path="/teacher" element={<AppLayout role="teacher" />}>
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="classes" element={<TeacherMyClasses />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="assignments" element={<TeacherAssignments />} />
            <Route path="exams" element={<TeacherExams />} />
            <Route path="grades" element={<TeacherGrades />} />
          </Route>
        </Route>

        {/* Student Routes */}
        <Route element={<RoleRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<AppLayout role="student" />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="subjects" element={<StudentSubjects />} />
            <Route path="timetable" element={<StudentTimetable />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="exams" element={<StudentExams />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="notifications" element={<StudentNotifications />} />
          </Route>
        </Route>

        {/* Parent Routes */}
        <Route element={<RoleRoute allowedRoles={['parent']} />}>
          <Route path="/parent" element={<AppLayout role="parent" />}>
            <Route index element={<Navigate to="/parent/dashboard" replace />} />
            <Route path="dashboard" element={<ParentDashboard />} />
            <Route path="children" element={<ParentChildren />} />
            <Route path="attendance" element={<ParentAttendance />} />
            <Route path="performance" element={<ParentPerformance />} />
            <Route path="fees" element={<ParentFees />} />
            <Route path="notifications" element={<ParentNotifications />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
