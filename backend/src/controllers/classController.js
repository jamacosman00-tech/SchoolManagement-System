import Class from '../models/Class.js';
import Student from '../models/Student.js';

/**
 * GET /api/classes
 */
export const getAllClasses = async (req, res, next) => {
  try {
    const classes = await Class.find()
      .populate('classTeacher', 'user employeeId')
      .populate({ path: 'classTeacher', populate: { path: 'user', select: 'name email' } })
      .sort({ name: 1 });

    return res.status(200).json({ success: true, count: classes.length, classes });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/classes/:id
 */
export const getClassById = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id)
      .populate({ path: 'classTeacher', populate: { path: 'user', select: 'name email phone' } })
      .populate({ path: 'students', populate: { path: 'user', select: 'name email avatar' } });

    if (!cls) return res.status(404).json({ success: false, message: 'Class not found.' });
    return res.status(200).json({ success: true, class: cls });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/classes
 */
export const createClass = async (req, res, next) => {
  try {
    const { name, section, classTeacher, academicYear } = req.body;
    const cls = await Class.create({ name, section, classTeacher, academicYear });
    return res.status(201).json({ success: true, message: 'Class created.', class: cls });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/classes/:id
 */
export const updateClass = async (req, res, next) => {
  try {
    const { name, section, classTeacher, academicYear } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (section !== undefined) updates.section = section;
    if (classTeacher !== undefined) updates.classTeacher = classTeacher;
    if (academicYear !== undefined) updates.academicYear = academicYear;

    const cls = await Class.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found.' });
    return res.status(200).json({ success: true, message: 'Class updated.', class: cls });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/classes/:id
 */
export const deleteClass = async (req, res, next) => {
  try {
    const cls = await Class.findByIdAndDelete(req.params.id);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found.' });
    return res.status(200).json({ success: true, message: 'Class deleted.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/classes/:id/students — Add student to class
 */
export const addStudentToClass = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const cls = await Class.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { students: studentId } },
      { new: true }
    );
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found.' });

    // Update student's class field
    await Student.findByIdAndUpdate(studentId, { class: cls._id });

    return res.status(200).json({ success: true, message: 'Student added to class.', class: cls });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/classes/:id/students/:studentId — Remove student from class
 */
export const removeStudentFromClass = async (req, res, next) => {
  try {
    const { id, studentId } = req.params;
    const cls = await Class.findByIdAndUpdate(id, { $pull: { students: studentId } }, { new: true });
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found.' });

    await Student.findByIdAndUpdate(studentId, { class: null });
    return res.status(200).json({ success: true, message: 'Student removed from class.', class: cls });
  } catch (error) {
    next(error);
  }
};
