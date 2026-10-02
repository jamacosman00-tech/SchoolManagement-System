import express from 'express';
import cors from 'cors';
//import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import studentRoutes from './routes/students.js';
import teacherRoutes from './routes/teachers.js';
import classRoutes from './routes/classes.js';
import subjectRoutes from './routes/subjects.js';
import attendanceRoutes from './routes/attendance.js';
import assignmentRoutes from './routes/assignments.js';
import examRoutes from './routes/exams.js';
import examResultRoutes from './routes/examResults.js';
import feeRoutes from './routes/fees.js';
import notificationRoutes from './routes/notifications.js';
import timetableRoutes from './routes/timetable.js';
import dashboardRoutes from './routes/dashboard.js';
import parentRoutes from './routes/parents.js';

dotenv.config();

const app = express();

// Connect Database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Global Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//if (process.env.NODE_ENV === 'development') {
 // app.use(morgan('dev'));
//}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'School Management API is running.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/exam-results', examResultRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/parents', parentRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
