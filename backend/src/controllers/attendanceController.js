import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

/**
 * POST /api/attendance/mark — Bulk mark attendance
 * Body: { classId, date, records: [{ studentId, status, remarks }] }
 */
export const markAttendance = async (req, res, next) => {
  try {
    const { classId, date, records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'Records array is required.' });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setUTCHours(0, 0, 0, 0);

    const ops = records.map((r) => ({
      updateOne: {
        filter: { student: r.studentId, class: classId, date: attendanceDate },
        update: {
          $set: {
            student: r.studentId,
            class: classId,
            date: attendanceDate,
            status: r.status,
            markedBy: req.user._id,
            remarks: r.remarks || '',
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);
    return res.status(200).json({ success: true, message: `Attendance marked for ${records.length} students.` });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/attendance/class/:classId?date=YYYY-MM-DD
 */
export const getAttendanceByClass = async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = { class: req.params.classId };

    if (date) {
      const d = new Date(date);
      d.setUTCHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      query.date = { $gte: d, $lt: nextDay };
    }

    const attendance = await Attendance.find(query)
      .populate({ path: 'student', populate: { path: 'user', select: 'name avatar' } })
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    return res.status(200).json({ success: true, count: attendance.length, attendance });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/attendance/student/:studentId?startDate=&endDate=
 */
export const getStudentAttendance = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { student: req.params.studentId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .populate('class', 'name section')
      .sort({ date: -1 });

    return res.status(200).json({ success: true, count: attendance.length, attendance });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/attendance/summary/:studentId
 * Returns attendance % breakdown
 */
export const getAttendanceSummary = async (req, res, next) => {
  try {
    const records = await Attendance.find({ student: req.params.studentId });
    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const late = records.filter((r) => r.status === 'late').length;
    const percentage = total > 0 ? ((present + late) / total * 100).toFixed(2) : '0.00';

    return res.status(200).json({
      success: true,
      summary: { total, present, absent, late, percentage: `${percentage}%` },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/attendance/:id
 */
export const updateAttendance = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const record = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status, remarks, markedBy: req.user._id },
      { new: true, runValidators: true }
    );
    if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    return res.status(200).json({ success: true, message: 'Attendance updated.', attendance: record });
  } catch (error) {
    next(error);
  }
};

export const deleteAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    return res.status(200).json({ success: true, message: 'Attendance record deleted.' });
  } catch (error) { next(error); }
};
