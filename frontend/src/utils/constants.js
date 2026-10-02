export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
}

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
}

export const FEE_TYPES = [
  'Tuition Fee',
  'Admission Fee',
  'Library Fee',
  'Lab Fee',
  'Sports Fee',
  'Transport Fee',
  'Examination Fee',
  'Other',
]

export const FEE_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  PARTIAL: 'partial',
}

export const EXAM_TYPES = [
  'Unit Test',
  'Mid Term',
  'Final Term',
  'Quiz',
  'Assignment',
  'Practical',
]

export const GRADE_SCALE = [
  { grade: 'A+', minPercent: 95, maxPercent: 100, gpa: 4.0 },
  { grade: 'A',  minPercent: 90, maxPercent: 94,  gpa: 4.0 },
  { grade: 'A-', minPercent: 85, maxPercent: 89,  gpa: 3.7 },
  { grade: 'B+', minPercent: 80, maxPercent: 84,  gpa: 3.3 },
  { grade: 'B',  minPercent: 75, maxPercent: 79,  gpa: 3.0 },
  { grade: 'B-', minPercent: 70, maxPercent: 74,  gpa: 2.7 },
  { grade: 'C+', minPercent: 65, maxPercent: 69,  gpa: 2.3 },
  { grade: 'C',  minPercent: 60, maxPercent: 64,  gpa: 2.0 },
  { grade: 'C-', minPercent: 55, maxPercent: 59,  gpa: 1.7 },
  { grade: 'D',  minPercent: 50, maxPercent: 54,  gpa: 1.0 },
  { grade: 'F',  minPercent: 0,  maxPercent: 49,  gpa: 0.0 },
]

export const DAYS_OF_WEEK = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday']

export const TIME_SLOTS = [
  '07:00 - 07:45',
  '07:45 - 08:30',
  '08:30 - 09:15',
  '09:15 - 10:00',
  '10:00 - 10:45',
  '10:45 - 11:30',
  '11:30 - 12:15',
  '12:15 - 01:00',
  '01:00 - 01:45',
  '01:45 - 02:30',
]

export const NOTIFICATION_TYPES = ['info', 'warning', 'success', 'alert']

export const NAV_ITEMS = {
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
    { label: 'Users', path: '/admin/users', icon: 'Users' },
    { label: 'Students', path: '/admin/students', icon: 'Users' },
    { label: 'Teachers', path: '/admin/teachers', icon: 'GraduationCap' },
    { label: 'Parents', path: '/admin/parents', icon: 'Users' },
    { label: 'Classes', path: '/admin/classes', icon: 'BookOpen' },
    { label: 'Subjects', path: '/admin/subjects', icon: 'BookMarked' },
    { label: 'Attendance', path: '/admin/attendance', icon: 'ClipboardCheck' },
    { label: 'Assignments', path: '/admin/assignments', icon: 'FileText' },
    { label: 'Exams', path: '/admin/exams', icon: 'PenSquare' },
    { label: 'Results', path: '/admin/results', icon: 'BarChart2' },
    { label: 'Fees', path: '/admin/fees', icon: 'DollarSign' },
    { label: 'Notifications', path: '/admin/notifications', icon: 'Bell' },
    { label: 'Reports', path: '/admin/reports', icon: 'TrendingUp' },
    { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
  ],
  teacher: [
    { label: 'Dashboard', path: '/teacher/dashboard', icon: 'LayoutDashboard' },
    { label: 'My Classes', path: '/teacher/classes', icon: 'BookOpen' },
    { label: 'Attendance', path: '/teacher/attendance', icon: 'ClipboardCheck' },
    { label: 'Assignments', path: '/teacher/assignments', icon: 'FileText' },
    { label: 'Exams', path: '/teacher/exams', icon: 'PenSquare' },
    { label: 'Grades', path: '/teacher/grades', icon: 'BarChart2' },
  ],
  student: [
    { label: 'Dashboard', path: '/student/dashboard', icon: 'LayoutDashboard' },
    { label: 'Subjects', path: '/student/subjects', icon: 'BookMarked' },
    { label: 'Timetable', path: '/student/timetable', icon: 'CalendarDays' },
    { label: 'Attendance', path: '/student/attendance', icon: 'ClipboardCheck' },
    { label: 'Assignments', path: '/student/assignments', icon: 'FileText' },
    { label: 'Exams', path: '/student/exams', icon: 'PenSquare' },
    { label: 'Results', path: '/student/results', icon: 'BarChart2' },
    { label: 'Notifications', path: '/student/notifications', icon: 'Bell' },
  ],
  parent: [
    { label: 'Dashboard', path: '/parent/dashboard', icon: 'LayoutDashboard' },
    { label: 'My Children', path: '/parent/children', icon: 'Users' },
    { label: 'Attendance', path: '/parent/attendance', icon: 'ClipboardCheck' },
    { label: 'Performance', path: '/parent/performance', icon: 'TrendingUp' },
    { label: 'Fees', path: '/parent/fees', icon: 'DollarSign' },
    { label: 'Notifications', path: '/parent/notifications', icon: 'Bell' },
  ],
}
