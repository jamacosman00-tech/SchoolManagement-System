import Student from '../models/Student.js';
import User from '../models/User.js';
import Class from '../models/Class.js';
import Attendance from '../models/Attendance.js';
import ExamResult from '../models/ExamResult.js';
import Fee from '../models/Fee.js';
import Assignment from '../models/Assignment.js';

/**
 * GET /api/students
 */
export const getAllStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', classId } = req.query;
    const query = {};

    if (classId) query.class = classId;

    // If searching, match against user name/email
    let userIds = null;
    if (search) {
      const users = await User.find({
        role: 'student',
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');
      userIds = users.map((u) => u._id);
      query.user = { $in: userIds };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [students, total] = await Promise.all([
      Student.find(query)
        .populate('user', 'name email avatar phone isActive')
        .populate('class', 'name section academicYear')
        .populate('parent', 'name email phone')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Student.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      students,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/students/:id
 */
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email avatar phone isActive')
      .populate('class', 'name section academicYear')
      .populate('parent', 'name email phone');

    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    return res.status(200).json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/students — Creates User + Student
 */
export const createStudent = async (req, res, next) => {
  try {
    const {
      name, email, password, phone,
      admissionNo, classId, rollNo, dateOfBirth, gender,
      bloodGroup, parentName, parentPhone, parentEmail, parentId, address,
    } = req.body;

    // Create user account
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    const user = await User.create({ name, email, password: password || 'Student@123', role: 'student', phone });

    // Create student profile
    let student;
    try {
      student = await Student.create({
      user: user._id,
      admissionNo,
      class: classId || null,
      rollNo,
      dateOfBirth,
      gender,
      bloodGroup,
      parentName,
      parentPhone,
      parentEmail,
      parent: parentId || null,
      address,
      });
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw error;
    }

    // Add student to class
    if (classId) {
      await Class.findByIdAndUpdate(classId, { $addToSet: { students: student._id } });
    }

    const populated = await student.populate('user', 'name email phone');
    return res.status(201).json({ success: true, message: 'Student created.', student: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/students/:id
 */
export const updateStudent = async (req, res, next) => {
  try {
    const {
      name, email, phone,
      admissionNo, classId, rollNo, dateOfBirth, gender,
      bloodGroup, parentName, parentPhone, parentEmail, parentId, address,
    } = req.body;

    const updates = {};
    if (admissionNo !== undefined) updates.admissionNo = admissionNo;
    if (classId !== undefined) updates.class = classId;
    if (rollNo !== undefined) updates.rollNo = rollNo;
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updates.gender = gender;
    if (bloodGroup !== undefined) updates.bloodGroup = bloodGroup;
    if (parentName !== undefined) updates.parentName = parentName;
    if (parentPhone !== undefined) updates.parentPhone = parentPhone;
    if (parentEmail !== undefined) updates.parentEmail = parentEmail;
    if (parentId !== undefined) updates.parent = parentId;
    if (address !== undefined) updates.address = address;

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    if (email !== undefined) {
      const duplicate = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: student.user } });
      if (duplicate) return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    if (classId !== undefined && student.class?.toString() !== classId?.toString()) {
      if (student.class) await Class.findByIdAndUpdate(student.class, { $pull: { students: student._id } });
      if (classId) await Class.findByIdAndUpdate(classId, { $addToSet: { students: student._id } });
    }
    Object.assign(student, updates);
    await student.validate();
    const user = await User.findById(student.user);
    if (user) {
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      if (phone !== undefined) user.phone = phone;
      await user.save();
    }
    await student.save();
    await student.populate('user', 'name email phone');

    return res.status(200).json({ success: true, message: 'Student updated.', student });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/students/:id
 */
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    // Remove from class
    if (student.class) {
      await Class.findByIdAndUpdate(student.class, { $pull: { students: student._id } });
    }
    await Promise.all([
      Attendance.deleteMany({ student: student._id }),
      ExamResult.deleteMany({ student: student._id }),
      Fee.deleteMany({ student: student._id }),
      Assignment.updateMany({}, { $pull: { submissions: { student: student._id } } }),
    ]);
    // Also delete the user account
    await User.findByIdAndDelete(student.user);

    return res.status(200).json({ success: true, message: 'Student deleted.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/students/class/:classId
 */
export const getStudentsByClass = async (req, res, next) => {
  try {
    const students = await Student.find({ class: req.params.classId })
      .populate('user', 'name email avatar phone isActive')
      .sort({ rollNo: 1 });

    return res.status(200).json({ success: true, count: students.length, students });
  } catch (error) {
    next(error);
  }
};
