import Timetable from '../models/Timetable.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';

/**
 * POST /api/timetable
 */
export const createTimetable = async (req, res, next) => {
  try {
    const { classId, subjectId, teacherId, dayOfWeek, startTime, endTime, room } = req.body;
    const entry = await Timetable.create({
      class: classId,
      subject: subjectId,
      teacher: teacherId,
      dayOfWeek,
      startTime,
      endTime,
      room: room || '',
    });
    const populated = await entry
      .populate('class', 'name section')
      .then(() => entry.populate('subject', 'name code'))
      .then(() => entry.populate({ path: 'teacher', populate: { path: 'user', select: 'name' } }));

    return res.status(201).json({ success: true, message: 'Timetable entry created.', timetable: entry });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/timetable/class/:classId
 */
export const getTimetableByClass = async (req, res, next) => {
  try {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const entries = await Timetable.find({ class: req.params.classId })
      .populate('subject', 'name code')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } });

    // Group by day
    const grouped = {};
    for (const day of dayOrder) {
      grouped[day] = entries
        .filter((e) => e.dayOfWeek === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    return res.status(200).json({ success: true, timetable: grouped });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/timetable/:id
 */
export const updateTimetable = async (req, res, next) => {
  try {
    const { subjectId, teacherId, dayOfWeek, startTime, endTime, room } = req.body;
    const updates = {};
    if (subjectId !== undefined) updates.subject = subjectId;
    if (teacherId !== undefined) updates.teacher = teacherId;
    if (dayOfWeek !== undefined) updates.dayOfWeek = dayOfWeek;
    if (startTime !== undefined) updates.startTime = startTime;
    if (endTime !== undefined) updates.endTime = endTime;
    if (room !== undefined) updates.room = room;

    const entry = await Timetable.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!entry) return res.status(404).json({ success: false, message: 'Timetable entry not found.' });
    return res.status(200).json({ success: true, message: 'Timetable updated.', timetable: entry });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/timetable/:id
 */
export const deleteTimetable = async (req, res, next) => {
  try {
    const entry = await Timetable.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: 'Timetable entry not found.' });
    return res.status(200).json({ success: true, message: 'Timetable entry deleted.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/timetable/my — For teachers or students based on their profile
 */
export const getMyTimetable = async (req, res, next) => {
  try {
    let entries = [];

    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ user: req.user._id });
      if (!teacher) return res.status(404).json({ success: false, message: 'Teacher profile not found.' });
      entries = await Timetable.find({ teacher: teacher._id })
        .populate('class', 'name section')
        .populate('subject', 'name code')
        .sort({ dayOfWeek: 1, startTime: 1 });
    } else if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) return res.status(404).json({ success: false, message: 'Student profile not found.' });
      if (!student.class) return res.status(200).json({ success: true, timetable: [] });
      entries = await Timetable.find({ class: student.class })
        .populate('subject', 'name code')
        .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } })
        .sort({ dayOfWeek: 1, startTime: 1 });
    }

    return res.status(200).json({ success: true, count: entries.length, timetable: entries });
  } catch (error) {
    next(error);
  }
};
