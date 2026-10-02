import Notification from '../models/Notification.js';
import User from '../models/User.js';

/**
 * POST /api/notifications
 * Admin creates notification — can target specific users, a role, or broadcast globally
 */
export const createNotification = async (req, res, next) => {
  try {
    const { title, message, type, recipientIds, targetRole, isGlobal } = req.body;

    let recipients = [];

    if (isGlobal || targetRole) {
      // Find all users matching role or all users if global
      const query = isGlobal ? {} : { role: targetRole };
      const users = await User.find(query).select('_id');
      recipients = users.map((u) => ({ user: u._id, isRead: false }));
    } else if (Array.isArray(recipientIds) && recipientIds.length > 0) {
      recipients = recipientIds.map((id) => ({ user: id, isRead: false }));
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || 'info',
      recipients,
      sender: req.user._id,
      isGlobal: isGlobal || false,
      targetRole: targetRole || '',
    });

    return res.status(201).json({ success: true, message: 'Notification sent.', notification });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notifications/my — Current user's notifications
 */
export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipients: { $elemMatch: { user: req.user._id } },
    })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 });

    const result = notifications.map((n) => {
      const obj = n.toObject();
      const myRec = n.recipients.find((r) => r.user.toString() === req.user._id.toString());
      obj.isRead = myRec?.isRead || false;
      obj.readAt = myRec?.readAt || null;
      obj.recipients = undefined;
      return obj;
    });

    return res.status(200).json({ success: true, count: result.length, notifications: result });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      'recipients': {
        $elemMatch: { user: req.user._id, isRead: false }
      }
    });
    return res.status(200).json({ success: true, count });
  } catch (error) {
    next(error);
  }
};

export const getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().populate('sender', 'name').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: notifications.length, notifications });
  } catch (error) { next(error); }
};

/**
 * PATCH /api/notifications/:id/read
 */
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, 'recipients.user': req.user._id },
      { $set: { 'recipients.$.isRead': true, 'recipients.$.readAt': new Date() } },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });
    return res.status(200).json({ success: true, message: 'Marked as read.' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/notifications/read-all
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { 'recipients.user': req.user._id, 'recipients.isRead': false },
      { $set: { 'recipients.$[elem].isRead': true, 'recipients.$[elem].readAt': new Date() } },
      { arrayFilters: [{ 'elem.user': req.user._id }] }
    );
    return res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/notifications/:id
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });
    return res.status(200).json({ success: true, message: 'Notification deleted.' });
  } catch (error) {
    next(error);
  }
};
