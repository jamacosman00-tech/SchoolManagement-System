import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';
import Attendance from '../models/Attendance.js';
import Fee from '../models/Fee.js';
import Notification from '../models/Notification.js';
import Exam from '../models/Exam.js';
import ExamResult from '../models/ExamResult.js';
import Assignment from '../models/Assignment.js';

/**
 * GET /api/dashboard/admin
 */
export const getAdminDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      totalUsers,
      feeSummary,
      attendanceToday,
      recentNotifications,
    ] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Class.countDocuments(),
      User.countDocuments(),
      Fee.aggregate([
        { $group: { _id: '$status', total: { $sum: '$amount' } } },
      ]),
      Attendance.aggregate([
        { $match: { date: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Notification.find()
        .populate('sender', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Monthly fee chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyFees = await Fee.aggregate([
      { $match: { status: 'paid', paidDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$paidDate' }, year: { $year: '$paidDate' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const feeBySatus = {};
    for (const f of feeSummary) {
      feeBySatus[f._id] = f.total;
    }
    const attendanceBySatus = {};
    for (const a of attendanceToday) {
      attendanceBySatus[a._id] = a.count;
    }

    return res.status(200).json({
      success: true,
      dashboard: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalUsers,
        fees: feeBySatus,
        attendanceToday: attendanceBySatus,
        recentNotifications,
        monthlyFeeChart: monthlyFees,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/teacher
 */
export const getTeacherDashboard = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user._id })
      .populate('classes', 'name section')
      .populate('subjects', 'name code');

    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher profile not found.' });

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    // Today's attendance for teacher's classes
    const classIds = teacher.classes.map((c) => c._id);
    const [attendanceSummary, pendingAssignments] = await Promise.all([
      Attendance.aggregate([
        { $match: { class: { $in: classIds }, date: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Assignment.find({ teacher: teacher._id, dueDate: { $gte: new Date() } })
        .populate('class', 'name')
        .populate('subject', 'name')
        .sort({ dueDate: 1 })
        .limit(5),
    ]);

    const attendanceMap = {};
    for (const a of attendanceSummary) {
      attendanceMap[a._id] = a.count;
    }

    return res.status(200).json({
      success: true,
      dashboard: {
        myClasses: teacher.classes,
        mySubjects: teacher.subjects,
        attendanceTodaySummary: attendanceMap,
        pendingAssignments,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/student
 */
export const getStudentDashboard = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('class', 'name section');
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found.' });

    const [attendanceRecords, upcomingExams, recentResults, unreadNotifications] = await Promise.all([
      Attendance.find({ student: student._id }),
      Exam.find({ class: student.class?._id, date: { $gte: new Date() } })
        .populate('subject', 'name')
        .sort({ date: 1 })
        .limit(5),
      ExamResult.find({ student: student._id })
        .populate({ path: 'exam', populate: { path: 'subject', select: 'name' } })
        .sort({ createdAt: -1 })
        .limit(5),
      Notification.countDocuments({
        recipients: { $elemMatch: { user: req.user._id, isRead: false } },
      }),
    ]);

    const total = attendanceRecords.length;
    const present = attendanceRecords.filter((r) => r.status === 'present').length;
    const late = attendanceRecords.filter((r) => r.status === 'late').length;
    const attendancePct = total > 0 ? (((present + late) / total) * 100).toFixed(2) : '0.00';

    return res.status(200).json({
      success: true,
      dashboard: {
        student: { name: req.user.name, class: student.class },
        attendancePercentage: `${attendancePct}%`,
        attendanceSummary: { total, present, absent: total - present - late, late },
        upcomingExams,
        recentResults,
        unreadNotifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/parent
 */
export const getParentDashboard = async (req, res, next) => {
  try {
    const children = await Student.find({ parent: req.user._id })
      .populate('user', 'name email avatar')
      .populate('class', 'name section');

    if (!children.length) {
      return res.status(200).json({ success: true, dashboard: { children: [], message: 'No children linked.' } });
    }

    const childrenData = await Promise.all(
      children.map(async (child) => {
        const [attendanceRecords, recentResults, pendingFees] = await Promise.all([
          Attendance.find({ student: child._id }),
          ExamResult.find({ student: child._id })
            .populate({ path: 'exam', populate: { path: 'subject', select: 'name' } })
            .sort({ createdAt: -1 })
            .limit(3),
          Fee.find({ student: child._id, status: { $in: ['pending', 'overdue'] } }),
        ]);

        const total = attendanceRecords.length;
        const present = attendanceRecords.filter((r) => r.status === 'present').length;
        const late = attendanceRecords.filter((r) => r.status === 'late').length;
        const pct = total > 0 ? (((present + late) / total) * 100).toFixed(2) : '0.00';

        return {
          student: { _id: child._id, name: child.user?.name, class: child.class },
          attendancePercentage: `${pct}%`,
          recentResults,
          pendingFees,
        };
      })
    );

    return res.status(200).json({ success: true, dashboard: { children: childrenData } });
  } catch (error) {
    next(error);
  }
};
