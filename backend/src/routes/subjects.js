import { Router } from 'express';
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectsByClass,
} from '../controllers/subjectController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin', 'teacher', 'student'), getAllSubjects);
router.post('/', authorize('admin'), createSubject);
router.get('/class/:classId', authorize('admin', 'teacher', 'student'), getSubjectsByClass);
router.get('/:id', authorize('admin', 'teacher', 'student'), getSubjectById);
router.put('/:id', authorize('admin'), updateSubject);
router.delete('/:id', authorize('admin'), deleteSubject);

export default router;
