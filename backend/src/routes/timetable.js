import { Router } from 'express';
import {
  createTimetable,
  getTimetableByClass,
  updateTimetable,
  deleteTimetable,
  getMyTimetable,
} from '../controllers/timetableController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/my', getMyTimetable);
router.get('/class/:classId', getTimetableByClass);
router.post('/', authorize('admin'), createTimetable);
router.put('/:id', authorize('admin'), updateTimetable);
router.delete('/:id', authorize('admin'), deleteTimetable);

export default router;
