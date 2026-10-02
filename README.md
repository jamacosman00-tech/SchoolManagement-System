# 🎓 School Management System (EduPortal Pro)

A modern, production-grade **School Management System** built with **React (Vite) + Tailwind CSS** on the frontend, and **Node.js + Express + MongoDB (Mongoose)** on the backend.

---

## 🌟 Key Features & Role-Based Access Control

### 👑 1. Admin Role
- **Overview Dashboard:** Real-time KPI summary (Total Students, Faculty, Active Classes, Fees Collected), interactive Recharts visualizations (weekly attendance bar charts, monthly fee collection area charts), and broadcast bulletin viewer.
- **Student Directory:** Full CRUD student management, cohort assignment, roll number generation, guardian contact cards, search, and class filters.
- **Faculty Directory:** Departmental faculty management, qualifications tracking, and subject/class assignments.
- **Classes & Cohorts:** Academic grade configuration, section divisions, student capacity tracking, and assigned class leads.
- **Curriculum & Subjects:** Course catalog, syllabus descriptions, and instructor mappings.
- **Attendance Register:** Cohort daily roll call with real-time status toggling (Present / Absent / Late), bulk marking, and attendance percentage metrics.
- **Coursework & Assignments:** Homework creation, deadline enforcement, submission tracking, and grading.
- **Examinations:** Term and midterm examination scheduling, hall allocation, and threshold criteria.
- **Grading & Results:** Grade entry with automated GPA calculation, letter grades ($A+$, $A$, $B$, $C$, $D$, $F$), and statistical metrics.
- **Fee Management:** Tuition invoice generation, payment status tracking (Paid / Pending / Overdue), and transaction reconciliation.
- **Announcements:** Targeted and global broadcast notification system.
- **Institutional Analytics:** Comprehensive reporting on attendance trends, grade distributions, and revenue statements with CSV exports.
- **System Settings:** School profile configuration, academic calendars, and administrative security credentials.

---

### 👨‍🏫 2. Teacher Role
- **Teacher Dashboard:** Daily lecture schedule, assigned cohorts, pending task evaluations, and attendance charts.
- **Assigned Classes:** Detailed class cards with student enrollment rosters.
- **Class Attendance:** Daily roll call for assigned sections.
- **Assignments & Homework:** Create and evaluate coursework with custom feedback.
- **Exams & Tests:** Schedule upcoming subject quizzes and midterm assessments.
- **Grading:** Enter marks and remarks for class examinations.

---

### 🎓 3. Student Role
- **Student Dashboard:** Personal attendance rate, cumulative GPA, upcoming exam alerts, and due assignment notifications.
- **Enrolled Subjects:** Course directory, instructors, credit hours, and classroom locations.
- **Weekly Timetable:** Interactive weekly lecture grid color-coded by subject.
- **Attendance Record:** Personal daily log history and monthly punctuality metrics.
- **Coursework:** Submit homework links and review instructor feedback with grades.
- **Exams:** Examination timetables and examination room instructions.
- **Results & Report Card:** Subject proficiency radar chart, detailed mark sheets, and downloadable report cards.
- **Notifications:** Receive academic notices and administrative bulletins.

---

### 👨‍👩‍👧 4. Parent Role
- **Parent Dashboard:** Real-time progress monitoring for enrolled children (attendance, GPA, tuition status).
- **My Children (Wards):** Academic profile cards, class teachers, blood group, and emergency contacts.
- **Attendance & Performance:** Child's roll call history and examination grade trends.
- **Fee Statements:** Invoices, payment receipts, and instant online payment action buttons.
- **School Communications:** Official parent-teacher conference notices and announcements.

---

## 🎨 UI / UX & Design System
- **Theme:** Seamless **Light & Dark mode** with smooth CSS transitions and persistent local storage state.
- **Navigation:** Modern responsive sidebar navigation (drawer on mobile devices, collapsible on desktop) paired with a sticky top navbar with notifications and user profile menu.
- **Color Palette:** Professional Indigo/Blue primary palette, Emerald for success, Amber for warning, Rose for danger, with high-contrast neutral backgrounds.
- **Components:** Reusable UI library (StatCard, Card, Table with sorting, Modal with headless transitions, Badge, Button with loading spinners, Avatar with initials fallback, ConfirmDialog, Toaster alerts).
- **Charts:** Interactive data visualizations powered by Recharts (Bar, Area, Line, and Radar charts).

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance running at `mongodb://localhost:27017` or MongoDB Atlas URI)

---

### 2. Backend Setup
```bash
cd backend
npm install
```

#### Configure Environment Variables:
A `.env` file is already created. You can customize it if needed:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/school_management
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

#### Seed Demo Database:
To populate the database with sample administrators, teachers, students, parents, classes, attendance records, assignments, exams, results, and fee bills:
```bash
npm run seed
```

#### Start Backend Server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

---

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Application opens at http://localhost:5173
```

---

## 🔑 Demo Login Credentials

The system includes pre-configured demo accounts. You can click the **Quick Demo Login** buttons on the login page or enter:

| Role | Email | Password |
| :--- | :--- | :--- |
| 👑 **Admin** | `admin@school.com` | `Password@123` |
| 👨‍🏫 **Teacher** | `marcus.vance@school.com` | `Password@123` |
| 🎓 **Student** | `student@school.com` | `Password@123` |
| 👨‍👩‍👧 **Parent** | `parent@school.com` | `Password@123` |

---

## 📁 Project Architecture

```
SchoolManagement System/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB Mongoose connection
│   │   ├── controllers/     # Handlers for Auth, Users, Students, Teachers, Classes, Subjects, Attendance, Assignments, Exams, ExamResults, Fees, Notifications, Timetable, Dashboard
│   │   ├── middleware/      # JWT Authentication, Role Authorization, Global Error Handler
│   │   ├── models/          # 12 Mongoose Schema Definitions
│   │   ├── routes/          # RESTful Express route definitions
│   │   ├── utils/           # Database Seeder (seedData.js)
│   │   └── app.js           # Express App Entrypoint
│   ├── .env
│   ├── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client modules
│   │   ├── components/
│   │   │   ├── charts/      # Recharts (Attendance, Fee, Performance, Subject Radar)
│   │   │   └── ui/          # Reusable UI library (Button, Modal, Table, Badge, Card, StatCard, Avatar, etc.)
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── hooks/           # useAuth, useTheme, useFetch
│   │   ├── layouts/         # Sidebar (drawer/collapsible), Navbar, AppLayout
│   │   ├── pages/
│   │   │   ├── admin/       # 13 Admin Pages
│   │   │   ├── teacher/     # 6 Teacher Pages
│   │   │   ├── student/     # 8 Student Pages
│   │   │   ├── parent/      # 6 Parent Pages
│   │   │   └── auth/        # Login Page with Quick Credentials Picker
│   │   ├── routes/          # PrivateRoute, RoleRoute
│   │   ├── utils/           # Helpers, formatters, constants
│   │   ├── App.jsx          # Route declarations
│   │   ├── main.jsx         # App mounting
│   │   └── index.css        # Tailwind CSS + custom styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```
