import { Router } from 'express';
import {
  getAllParents,
  getParentById,
  createParent,
  updateParent,
  deleteParent,
} from '../controllers/parentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorize('admin', 'teacher'));

router.get('/', getAllParents);
router.get('/:id', getParentById);
router.post('/', authorize('admin'), createParent);
router.put('/:id', authorize('admin'), updateParent);
router.delete('/:id', authorize('admin'), deleteParent);

export default router;
