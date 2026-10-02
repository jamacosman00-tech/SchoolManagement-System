import Teacher from '../models/Teacher.js';
import User from '../models/User.js';

/**
 * GET /api/teachers
 */
export const getAllTeachers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let userQuery = { role: 'teacher' };
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(userQuery).select('_id');
    const userIds = users.map((u) => u._id);

    const query = search ? { user: { $in: userIds } } : {};

    const [teachers, total] = await Promise.all([
      Teacher.find(query)
        .populate('user', 'name email avatar phone isActive')
        .populate('subjects', 'name code')
        .populate('classes', 'name section')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Teacher.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      teachers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/teachers/:id
 */
export const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('user', 'name email avatar phone isActive')
      .populate('subjects', 'name code description')
      .populate('classes', 'name section academicYear');

    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });
    return res.status(200).json({ success: true, teacher });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/teachers — Creates User + Teacher
 */
export const createTeacher = async (req, res, next) => {
  try {
    const {
      name, email, password, phone,
      employeeId, subjects, classes, qualification, experience, salary,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password: password || 'Teacher@123', role: 'teacher', phone });

    let teacher;
    try {
      teacher = await Teacher.create({
      user: user._id,
      employeeId,
      subjects: subjects || [],
      classes: classes || [],
      qualification,
      experience,
      salary,
      });
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw error;
    }

    const populated = await teacher.populate('user', 'name email phone');
    return res.status(201).json({ success: true, message: 'Teacher created.', teacher: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/teachers/:id
 */
export const updateTeacher = async (req, res, next) => {
  try {
    const { name, email, phone, employeeId, subjects, classes, qualification, experience, salary } = req.body;
    const updates = {};
    if (employeeId !== undefined) updates.employeeId = employeeId;
    if (subjects !== undefined) updates.subjects = subjects;
    if (classes !== undefined) updates.classes = classes;
    if (qualification !== undefined) updates.qualification = qualification;
    if (experience !== undefined) updates.experience = experience;
    if (salary !== undefined) updates.salary = salary;

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });
    if (email !== undefined) {
      const duplicate = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: teacher.user } });
      if (duplicate) return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    Object.assign(teacher, updates);
    await teacher.validate();
    const user = await User.findById(teacher.user);
    if (user) {
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      if (phone !== undefined) user.phone = phone;
      await user.save();
    }
    await teacher.save();
    await teacher.populate('user', 'name email phone');

    return res.status(200).json({ success: true, message: 'Teacher updated.', teacher });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/teachers/:id
 */
export const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });

    await User.findByIdAndDelete(teacher.user);
    return res.status(200).json({ success: true, message: 'Teacher deleted.' });
  } catch (error) {
    next(error);
  }
};
