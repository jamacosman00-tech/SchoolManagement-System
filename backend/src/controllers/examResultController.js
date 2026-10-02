import ExamResult from '../models/ExamResult.js';
import Exam from '../models/Exam.js';
import Student from '../models/Student.js';

/**
 * POST /api/exam-results/enter — Bulk enter results
 * Body: { examId, results: [{ studentId, marksObtained, remarks, isAbsent }] }
 */
export const enterResults = async (req, res, next) => {
  try {
    const { examId, results } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });

    const ops = results.map((r) => {
      const grade = r.isAbsent ? 'AB' : ExamResult.computeGrade(r.marksObtained, exam.maxMarks);
      return {
        updateOne: {
          filter: { exam: examId, student: r.studentId },
          update: {
            $set: {
              exam: examId,
              student: r.studentId,
              marksObtained: r.isAbsent ? 0 : r.marksObtained,
              grade,
              remarks: r.remarks || '',
              isAbsent: r.isAbsent || false,
              gradedBy: req.user._id,
            },
          },
          upsert: true,
        },
      };
    });

    await ExamResult.bulkWrite(ops);
    return res.status(200).json({ success: true, message: `Results entered for ${results.length} students.` });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/exam-results/exam/:examId
 */
export const getResultsByExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.examId).populate('class', 'name section');
    const results = await ExamResult.find({ exam: req.params.examId })
      .populate({ path: 'student', populate: { path: 'user', select: 'name avatar' } })
      .populate('gradedBy', 'name')
      .sort({ marksObtained: -1 });

    const enriched = results.map((r) => {
      const obj = r.toObject();
      obj.percentage = exam ? ((r.marksObtained / exam.maxMarks) * 100).toFixed(2) : null;
      return obj;
    });

    return res.status(200).json({ success: true, count: enriched.length, results: enriched, exam });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/exam-results/student/:studentId
 */
export const getStudentResults = async (req, res, next) => {
  try {
    const results = await ExamResult.find({ student: req.params.studentId })
      .populate({ path: 'exam', populate: [{ path: 'subject', select: 'name code' }, { path: 'class', select: 'name' }] })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: results.length, results });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/exam-results/:id
 */
export const updateResult = async (req, res, next) => {
  try {
    const { marksObtained, remarks, isAbsent } = req.body;
    const result = await ExamResult.findById(req.params.id).populate('exam');
    if (!result) return res.status(404).json({ success: false, message: 'Result not found.' });

    if (marksObtained !== undefined) result.marksObtained = marksObtained;
    if (remarks !== undefined) result.remarks = remarks;
    if (isAbsent !== undefined) result.isAbsent = isAbsent;
    result.grade = isAbsent
      ? 'AB'
      : ExamResult.computeGrade(marksObtained ?? result.marksObtained, result.exam.maxMarks);
    result.gradedBy = req.user._id;
    await result.save();

    return res.status(200).json({ success: true, message: 'Result updated.', result });
  } catch (error) {
    next(error);
  }
};

export const deleteResult = async (req, res, next) => {
  try {
    const result = await ExamResult.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Result not found.' });
    return res.status(200).json({ success: true, message: 'Result deleted.' });
  } catch (error) { next(error); }
};

/**
 * GET /api/exam-results/report-card/:studentId?academicYear=&term=
 * Returns all exam results grouped by subject
 */
export const getReportCard = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate('user', 'name email');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const results = await ExamResult.find({ student: studentId })
      .populate({
        path: 'exam',
        populate: [
          { path: 'subject', select: 'name code' },
          { path: 'class', select: 'name section' },
        ],
      })
      .sort({ createdAt: -1 });

    // Group by subject
    const grouped = {};
    for (const r of results) {
      const subjectName = r.exam?.subject?.name || 'Unknown';
      if (!grouped[subjectName]) grouped[subjectName] = [];
      grouped[subjectName].push({
        examName: r.exam?.name,
        examType: r.exam?.examType,
        date: r.exam?.date,
        maxMarks: r.exam?.maxMarks,
        marksObtained: r.marksObtained,
        grade: r.grade,
        isAbsent: r.isAbsent,
        percentage: r.exam?.maxMarks
          ? ((r.marksObtained / r.exam.maxMarks) * 100).toFixed(2)
          : null,
      });
    }

    return res.status(200).json({
      success: true,
      student,
      reportCard: grouped,
      totalExams: results.length,
    });
  } catch (error) {
    next(error);
  }
};
