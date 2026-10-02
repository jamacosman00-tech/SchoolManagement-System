import { Router } from 'express';
import {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  getExamsByClass,
} from '../controllers/examController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin', 'teacher', 'student'), getAllExams);
router.post('/', authorize('admin', 'teacher'), createExam);
router.get('/class/:classId', authorize('admin', 'teacher', 'student'), getExamsByClass);
router.get('/:id', authorize('admin', 'teacher', 'student'), getExamById);
router.put('/:id', authorize('admin', 'teacher'), updateExam);
router.delete('/:id', authorize('admin'), deleteExam);

export default router;
