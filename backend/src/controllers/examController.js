import Exam from '../models/Exam.js';

/**
 * POST /api/exams
 */
export const createExam = async (req, res, next) => {
  try {
    const { name, subjectId, classId, examType, date, startTime, endTime, maxMarks, passingMarks, instructions } = req.body;
    const exam = await Exam.create({
      name,
      subject: subjectId,
      class: classId,
      examType,
      date,
      startTime,
      endTime,
      maxMarks,
      passingMarks,
      instructions,
    });
    return res.status(201).json({ success: true, message: 'Exam created.', exam });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/exams
 */
export const getAllExams = async (req, res, next) => {
  try {
    const { classId, subjectId, examType } = req.query;
    const query = {};
    if (classId) query.class = classId;
    if (subjectId) query.subject = subjectId;
    if (examType) query.examType = examType;

    const exams = await Exam.find(query)
      .populate('subject', 'name code')
      .populate('class', 'name section')
      .sort({ date: 1 });

    return res.status(200).json({ success: true, count: exams.length, exams });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/exams/:id
 */
export const getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('subject', 'name code description')
      .populate('class', 'name section academicYear');

    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });
    return res.status(200).json({ success: true, exam });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/exams/:id
 */
export const updateExam = async (req, res, next) => {
  try {
    const { name, subjectId, classId, examType, date, startTime, endTime, maxMarks, passingMarks, instructions } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (subjectId !== undefined) updates.subject = subjectId;
    if (classId !== undefined) updates.class = classId;
    if (examType !== undefined) updates.examType = examType;
    if (date !== undefined) updates.date = date;
    if (startTime !== undefined) updates.startTime = startTime;
    if (endTime !== undefined) updates.endTime = endTime;
    if (maxMarks !== undefined) updates.maxMarks = maxMarks;
    if (passingMarks !== undefined) updates.passingMarks = passingMarks;
    if (instructions !== undefined) updates.instructions = instructions;

    const exam = await Exam.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });
    return res.status(200).json({ success: true, message: 'Exam updated.', exam });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/exams/:id
 */
export const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });
    return res.status(200).json({ success: true, message: 'Exam deleted.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/exams/class/:classId
 */
export const getExamsByClass = async (req, res, next) => {
  try {
    const exams = await Exam.find({ class: req.params.classId })
      .populate('subject', 'name code')
      .sort({ date: 1 });

    return res.status(200).json({ success: true, count: exams.length, exams });
  } catch (error) {
    next(error);
  }
};
