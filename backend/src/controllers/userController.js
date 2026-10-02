import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

/**
 * GET /api/users — Admin: list all users with pagination, search, role filter
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', role } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Generate a sequential admission number like ADM-0042 (retries if collision) */
async function nextAdmissionNo() {
  const count = await Student.countDocuments();
  const base = `ADM-${String(count + 1).padStart(4, '0')}`;
  // If that number is already taken (edge case), append random suffix
  const taken = await Student.findOne({ admissionNo: base });
  return taken ? `ADM-${Date.now()}` : base;
}

/** Generate a sequential employee ID like EMP-0007 */
async function nextEmployeeId() {
  const count = await Teacher.countDocuments();
  const base = `EMP-${String(count + 1).padStart(4, '0')}`;
  const taken = await Teacher.findOne({ employeeId: base });
  return taken ? `EMP-${Date.now()}` : base;
}

/** Ensure a Student profile exists for the given user, create one if not. */
async function ensureStudentProfile(user, extra = {}) {
  const existing = await Student.findOne({ user: user._id });
  if (existing) return existing;
  const admissionNo = await nextAdmissionNo();
  return Student.create({
    user: user._id,
    admissionNo,
    gender: extra.gender || 'other',
    dateOfBirth: extra.dateOfBirth ? new Date(extra.dateOfBirth) : new Date('2000-01-01'),
    joinDate: new Date(),
  });
}

/** Ensure a Teacher profile exists for the given user, create one if not. */
async function ensureTeacherProfile(user) {
  const existing = await Teacher.findOne({ user: user._id });
  if (existing) return existing;
  const employeeId = await nextEmployeeId();
  return Teacher.create({
    user: user._id,
    employeeId,
    joinDate: new Date(),
  });
}

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/users
 * Automatically creates a linked Student or Teacher profile when role is student/teacher.
 */
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address, gender, dateOfBirth } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, password and role are required.' });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password, role, phone, address });

    let profile = null;
    if (role === 'student') {
      profile = await ensureStudentProfile(user, { gender, dateOfBirth });
    } else if (role === 'teacher') {
      profile = await ensureTeacherProfile(user);
    }

    return res.status(201).json({
      success: true,
      message: profile
        ? `User and ${role} profile created successfully.`
        : 'User created successfully.',
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * If role changes to student/teacher, auto-creates the missing profile.
 */
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, phone, avatar, address, isActive, gender, dateOfBirth } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // Check email uniqueness
    if (email !== undefined) {
      const dup = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: user._id } });
      if (dup) return res.status(409).json({ success: false, message: 'Email already registered.' });
      user.email = email.trim().toLowerCase();
    }

    const oldRole = user.role;
    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (address !== undefined) user.address = address;
    if (isActive !== undefined) user.isActive = isActive;
    await user.save();

    // Auto-create profile if role changed to student/teacher
    let profile = null;
    const newRole = role || oldRole;
    if (newRole !== oldRole || newRole === 'student' || newRole === 'teacher') {
      if (newRole === 'student') {
        profile = await ensureStudentProfile(user, { gender, dateOfBirth });
      } else if (newRole === 'teacher') {
        profile = await ensureTeacherProfile(user);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Also removes the linked Student or Teacher profile.
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user._id.equals(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own signed-in account.' });
    }

    // Clean up linked profiles before deleting the user
    if (user.role === 'student') await Student.deleteOne({ user: user._id });
    if (user.role === 'teacher') await Teacher.deleteOne({ user: user._id });
    if (user.role === 'parent') await Student.updateMany({ parent: user._id }, { $set: { parent: null } });

    await User.findByIdAndDelete(user._id);
    return res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/:id/toggle-status
 */
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};
