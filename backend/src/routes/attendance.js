import { Router } from 'express';
import {
  markAttendance,
  getAttendanceByClass,
  getStudentAttendance,
  getAttendanceSummary,
  updateAttendance,
  deleteAttendance,
} from '../controllers/attendanceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/mark', authorize('teacher', 'admin'), markAttendance);
router.get('/class/:classId', authorize('teacher', 'admin'), getAttendanceByClass);
router.get('/student/:studentId', authorize('teacher', 'admin', 'student', 'parent'), getStudentAttendance);
router.get('/summary/:studentId', authorize('teacher', 'admin', 'student', 'parent'), getAttendanceSummary);
router.put('/:id', authorize('teacher', 'admin'), updateAttendance);
router.delete('/:id', authorize('admin'), deleteAttendance);

export default router;
