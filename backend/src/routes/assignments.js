import { Router } from 'express';
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
  getMyAssignments,
  getSubmissions,
} from '../controllers/assignmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/my', authorize('student'), getMyAssignments);
router.get('/', authorize('admin', 'teacher', 'student'), getAllAssignments);
router.post('/', authorize('teacher', 'admin'), createAssignment);
router.get('/:id', authorize('admin', 'teacher', 'student'), getAssignmentById);
router.get('/:id/submissions', authorize('teacher', 'admin'), getSubmissions);
router.put('/:id', authorize('teacher', 'admin'), updateAssignment);
router.delete('/:id', authorize('teacher', 'admin'), deleteAssignment);
router.post('/:id/submit', authorize('student'), submitAssignment);
router.put('/:id/grade/:studentId', authorize('teacher', 'admin'), gradeSubmission);

export default router;
