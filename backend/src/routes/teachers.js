import { Router } from 'express';
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '../controllers/teacherController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin', 'teacher', 'student'), getAllTeachers);
router.post('/', authorize('admin'), createTeacher);
router.get('/:id', authorize('admin', 'teacher', 'student'), getTeacherById);
router.put('/:id', authorize('admin'), updateTeacher);
router.delete('/:id', authorize('admin'), deleteTeacher);

export default router;
