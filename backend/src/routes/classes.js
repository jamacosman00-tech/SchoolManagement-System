import { Router } from 'express';
import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
} from '../controllers/classController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin', 'teacher', 'student', 'parent'), getAllClasses);
router.post('/', authorize('admin'), createClass);
router.get('/:id', authorize('admin', 'teacher', 'student', 'parent'), getClassById);
router.put('/:id', authorize('admin'), updateClass);
router.delete('/:id', authorize('admin'), deleteClass);
router.post('/:id/students', authorize('admin'), addStudentToClass);
router.delete('/:id/students/:studentId', authorize('admin'), removeStudentFromClass);

export default router;
