import { Router } from 'express';
import {
  createNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getAllNotifications,
  getUnreadCount,
} from '../controllers/notificationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/my', getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.get('/', authorize('admin'), getAllNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.post('/', authorize('admin'), createNotification);
router.delete('/:id', authorize('admin'), deleteNotification);

export default router;
