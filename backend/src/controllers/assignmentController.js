import Assignment from '../models/Assignment.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';

/**
 * POST /api/assignments
 */
export const createAssignment = async (req, res, next) => {
  try {
    const { title, description, subjectId, classId, dueDate, maxMarks, attachments } = req.body;

    const teacher = req.user.role === 'admin' && req.body.teacherId
      ? await Teacher.findById(req.body.teacherId)
      : await Teacher.findOne({ user: req.user._id });
    if (!teacher) return res.status(403).json({ success: false, message: 'Teacher profile not found.' });

    const assignment = await Assignment.create({
      title,
      description,
      subject: subjectId,
      class: classId,
      teacher: teacher._id,
      dueDate,
      maxMarks,
      attachments: attachments || [],
    });

    return res.status(201).json({ success: true, message: 'Assignment created.', assignment });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assignments
 */
export const getAllAssignments = async (req, res, next) => {
  try {
    const { classId, subjectId } = req.query;
    const query = {};
    if (classId) query.class = classId;
    if (subjectId) query.subject = subjectId;

    const assignments = await Assignment.find(query)
      .populate('subject', 'name code')
      .populate('class', 'name section')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name email' } })
      .sort({ dueDate: 1 });

    return res.status(200).json({ success: true, count: assignments.length, assignments });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assignments/:id
 */
export const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subject', 'name code')
      .populate('class', 'name section')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name email' } })
      .populate({ path: 'submissions.student', populate: { path: 'user', select: 'name' } });

    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found.' });
    return res.status(200).json({ success: true, assignment });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/assignments/:id
 */
export const updateAssignment = async (req, res, next) => {
  try {
    const { title, description, subjectId, classId, teacherId, dueDate, maxMarks, attachments } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (subjectId !== undefined) updates.subject = subjectId;
    if (classId !== undefined) updates.class = classId;
    if (teacherId !== undefined) updates.teacher = teacherId;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (maxMarks !== undefined) updates.maxMarks = maxMarks;
    if (attachments !== undefined) updates.attachments = attachments;

    const assignment = await Assignment.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found.' });
    return res.status(200).json({ success: true, message: 'Assignment updated.', assignment });
  } catch (error) {
    next(error);
  }
};

export const getSubmissions = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate({ path: 'submissions.student', populate: { path: 'user', select: 'name email' } });
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found.' });
    return res.status(200).json({ success: true, submissions: assignment.submissions });
  } catch (error) { next(error); }
};

/**
 * DELETE /api/assignments/:id
 */
export const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found.' });
    return res.status(200).json({ success: true, message: 'Assignment deleted.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/assignments/:id/submit — Student submits
 */
export const submitAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found.' });

    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(403).json({ success: false, message: 'Student profile not found.' });

    const alreadySubmitted = assignment.submissions.find(
      (s) => s.student.toString() === student._id.toString()
    );
    if (alreadySubmitted) {
      return res.status(409).json({ success: false, message: 'Assignment already submitted.' });
    }

    assignment.submissions.push({
      student: student._id,
      submittedAt: new Date(),
      fileUrl: req.body.fileUrl || '',
    });
    await assignment.save();

    return res.status(200).json({ success: true, message: 'Assignment submitted successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/assignments/:id/grade/:studentId — Teacher grades submission
 */
export const gradeSubmission = async (req, res, next) => {
  try {
    const { marks, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found.' });

    const submission = assignment.submissions.find(
      (s) => s.student.toString() === req.params.studentId
    );
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found.' });

    submission.marks = marks;
    submission.feedback = feedback || '';
    submission.isGraded = true;
    await assignment.save();

    return res.status(200).json({ success: true, message: 'Submission graded.', submission });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assignments/my — Student sees their assignments
 */
export const getMyAssignments = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(403).json({ success: false, message: 'Student profile not found.' });

    const assignments = await Assignment.find({ class: student.class })
      .populate('subject', 'name code')
      .sort({ dueDate: 1 });

    // Annotate with submission status
    const result = assignments.map((a) => {
      const aObj = a.toObject();
      const sub = a.submissions.find((s) => s.student.toString() === student._id.toString());
      aObj.mySubmission = sub || null;
      aObj.submissions = undefined; // hide other submissions
      return aObj;
    });

    return res.status(200).json({ success: true, count: result.length, assignments: result });
  } catch (error) {
    next(error);
  }
};
