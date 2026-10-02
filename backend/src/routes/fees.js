import { Router } from 'express';
import {
  createFeeBill,
  getAllFees,
  getFeeById,
  updateFeeStatus,
  getStudentFees,
  getFeesSummary,
  deleteFee,
} from '../controllers/feeController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/summary', authorize('admin'), getFeesSummary);
router.get('/student/:studentId', authorize('admin', 'teacher', 'student', 'parent'), getStudentFees);
router.get('/', authorize('admin'), getAllFees);
router.get('/:id', authorize('admin', 'parent', 'student'), getFeeById);
router.post('/', authorize('admin'), createFeeBill);
router.patch('/:id', authorize('admin'), updateFeeStatus);
router.delete('/:id', authorize('admin'), deleteFee);

export default router;
