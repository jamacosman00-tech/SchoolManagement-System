import Fee from '../models/Fee.js';
import Student from '../models/Student.js';

/**
 * POST /api/fees
 */
export const createFeeBill = async (req, res, next) => {
  try {
    const { studentId, feeType, amount, dueDate, academicYear, term, remarks } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const fee = await Fee.create({ student: studentId, feeType, amount, dueDate, academicYear, term, remarks });
    return res.status(201).json({ success: true, message: 'Fee bill created.', fee });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/fees
 */
export const getAllFees = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, academicYear, term } = req.query;
    const query = {};
    if (status) query.status = status;
    if (academicYear) query.academicYear = academicYear;
    if (term) query.term = term;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [fees, total] = await Promise.all([
      Fee.find(query)
        .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ dueDate: 1 }),
      Fee.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      fees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/fees/:id
 */
export const getFeeById = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id).populate({
      path: 'student',
      populate: { path: 'user', select: 'name email phone' },
    });
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found.' });
    return res.status(200).json({ success: true, fee });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/fees/:id — Update fee status (mark as paid, waive, etc.)
 */
export const updateFeeStatus = async (req, res, next) => {
  try {
    const { studentId, feeType, amount, dueDate, academicYear, term, status, paymentMethod, transactionId, paidDate, remarks } = req.body;
    const updates = {};
    if (studentId !== undefined) updates.student = studentId;
    if (feeType !== undefined) updates.feeType = feeType;
    if (amount !== undefined) updates.amount = amount;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (academicYear !== undefined) updates.academicYear = academicYear;
    if (term !== undefined) updates.term = term;
    if (status) updates.status = status;
    if (paymentMethod !== undefined) updates.paymentMethod = paymentMethod;
    if (transactionId !== undefined) updates.transactionId = transactionId;
    if (paidDate !== undefined) updates.paidDate = paidDate;
    if (status === 'paid' && !paidDate) updates.paidDate = new Date();
    if (remarks !== undefined) updates.remarks = remarks;

    const fee = await Fee.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found.' });
    return res.status(200).json({ success: true, message: 'Fee status updated.', fee });
  } catch (error) {
    next(error);
  }
};

export const deleteFee = async (req, res, next) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found.' });
    return res.status(200).json({ success: true, message: 'Fee record deleted.' });
  } catch (error) { next(error); }
};

/**
 * GET /api/fees/student/:studentId
 */
export const getStudentFees = async (req, res, next) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId }).sort({ dueDate: 1 });
    return res.status(200).json({ success: true, count: fees.length, fees });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/fees/summary — Total collected, pending, overdue
 */
export const getFeesSummary = async (req, res, next) => {
  try {
    const { academicYear } = req.query;
    const match = academicYear ? { academicYear } : {};

    const [totalCollected, totalPending, totalOverdue, totalWaived] = await Promise.all([
      Fee.aggregate([{ $match: { ...match, status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Fee.aggregate([{ $match: { ...match, status: 'pending' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Fee.aggregate([{ $match: { ...match, status: 'overdue' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Fee.aggregate([{ $match: { ...match, status: 'waived' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    // Monthly collection data
    const monthlyData = await Fee.aggregate([
      { $match: { status: 'paid', paidDate: { $ne: null }, ...match } },
      {
        $group: {
          _id: { month: { $month: '$paidDate' }, year: { $year: '$paidDate' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return res.status(200).json({
      success: true,
      summary: {
        totalCollected: totalCollected[0]?.total || 0,
        totalPending: totalPending[0]?.total || 0,
        totalOverdue: totalOverdue[0]?.total || 0,
        totalWaived: totalWaived[0]?.total || 0,
        monthlyData,
      },
    });
  } catch (error) {
    next(error);
  }
};
