import { Router } from 'express';
import {
  enterResults,
  getResultsByExam,
  getStudentResults,
  updateResult,
  getReportCard,
  deleteResult,
} from '../controllers/examResultController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/enter', authorize('admin', 'teacher'), enterResults);
router.get('/exam/:examId', authorize('admin', 'teacher', 'student', 'parent'), getResultsByExam);
router.get('/student/:studentId', authorize('admin', 'teacher', 'student', 'parent'), getStudentResults);
router.get('/report-card/:studentId', authorize('admin', 'teacher', 'student', 'parent'), getReportCard);
router.put('/:id', authorize('admin', 'teacher'), updateResult);
router.delete('/:id', authorize('admin'), deleteResult);

export default router;
