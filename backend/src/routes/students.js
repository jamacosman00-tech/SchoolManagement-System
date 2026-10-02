import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass,
} from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin', 'teacher'), getAllStudents);
router.post('/', authorize('admin'), createStudent);
router.get('/class/:classId', authorize('admin', 'teacher'), getStudentsByClass);
router.get('/:id', authorize('admin', 'teacher', 'student', 'parent'), getStudentById);
router.put('/:id', authorize('admin'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);

export default router;
