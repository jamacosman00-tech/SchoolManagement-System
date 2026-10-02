import Subject from '../models/Subject.js';

/**
 * GET /api/subjects
 */
export const getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find()
      .populate('class', 'name section')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name email' } })
      .sort({ name: 1 });

    return res.status(200).json({ success: true, count: subjects.length, subjects });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/subjects/:id
 */
export const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('class', 'name section academicYear')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name email phone' } });

    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found.' });
    return res.status(200).json({ success: true, subject });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/subjects
 */
export const createSubject = async (req, res, next) => {
  try {
    const { name, code, classId, teacher, description } = req.body;
    const subject = await Subject.create({ name, code, class: classId, teacher, description });
    return res.status(201).json({ success: true, message: 'Subject created.', subject });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/subjects/:id
 */
export const updateSubject = async (req, res, next) => {
  try {
    const { name, code, classId, teacher, description } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (code !== undefined) updates.code = code;
    if (classId !== undefined) updates.class = classId;
    if (teacher !== undefined) updates.teacher = teacher;
    if (description !== undefined) updates.description = description;

    const subject = await Subject.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found.' });
    return res.status(200).json({ success: true, message: 'Subject updated.', subject });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/subjects/:id
 */
export const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found.' });
    return res.status(200).json({ success: true, message: 'Subject deleted.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/subjects/class/:classId
 */
export const getSubjectsByClass = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ class: req.params.classId })
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name email' } });

    return res.status(200).json({ success: true, count: subjects.length, subjects });
  } catch (error) {
    next(error);
  }
};
