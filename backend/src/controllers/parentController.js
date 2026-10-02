import User from '../models/User.js';
import Student from '../models/Student.js';

/**
 * GET /api/parents
 * Admin/Teacher: Fetch all parents with their linked children
 */
export const getAllParents = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const query = { role: 'parent' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [parents, total] = await Promise.all([
      User.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    // Fetch linked children for each parent
    const parentIds = parents.map((p) => p._id);
    const students = await Student.find({ parent: { $in: parentIds } })
      .populate('user', 'name email avatar')
      .populate('class', 'name section');

    const studentsByParent = {};
    for (const st of students) {
      const pId = st.parent?.toString();
      if (!pId) continue;
      if (!studentsByParent[pId]) studentsByParent[pId] = [];
      studentsByParent[pId].push({
        _id: st._id,
        name: st.user?.name || st.name,
        admissionNo: st.admissionNo,
        rollNo: st.rollNo,
        class: st.class ? `${st.class.name} - ${st.class.section}` : 'Unassigned',
      });
    }

    const enrichedParents = parents.map((p) => {
      const pObj = p.toObject();
      pObj.children = studentsByParent[p._id.toString()] || [];
      return pObj;
    });

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      parents: enrichedParents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/parents/:id
 */
export const getParentById = async (req, res, next) => {
  try {
    const parent = await User.findOne({ _id: req.params.id, role: 'parent' });
    if (!parent) return res.status(404).json({ success: false, message: 'Parent not found.' });

    const students = await Student.find({ parent: parent._id })
      .populate('user', 'name email avatar phone')
      .populate('class', 'name section');

    const pObj = parent.toObject();
    pObj.children = students.map((st) => ({
      _id: st._id,
      name: st.user?.name || st.name,
      email: st.user?.email,
      admissionNo: st.admissionNo,
      rollNo: st.rollNo,
      class: st.class ? `${st.class.name} - ${st.class.section}` : 'Unassigned',
    }));

    return res.status(200).json({ success: true, parent: pObj });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/parents — Create Parent User & Link Children
 */
export const createParent = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, studentIds } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Parent name and email are required.' });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    const parentUser = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: password || 'Password@123',
      role: 'parent',
      phone: phone || '',
      address: typeof address === 'string' ? { street: address } : (address || {}),
    });

    // Link students to this parent
    if (Array.isArray(studentIds) && studentIds.length > 0) {
      await Student.updateMany(
        { _id: { $in: studentIds } },
        {
          $set: {
            parent: parentUser._id,
            parentName: parentUser.name,
            parentPhone: parentUser.phone,
            parentEmail: parentUser.email,
          },
        }
      );
    }

    const students = await Student.find({ parent: parentUser._id })
      .populate('user', 'name email')
      .populate('class', 'name section');

    const pObj = parentUser.toObject();
    pObj.children = students.map((st) => ({
      _id: st._id,
      name: st.user?.name,
      admissionNo: st.admissionNo,
      class: st.class ? `${st.class.name} - ${st.class.section}` : 'Unassigned',
    }));

    return res.status(201).json({ success: true, message: 'Parent account created.', parent: pObj });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/parents/:id — Update Parent & Link/Unlink Children
 */
export const updateParent = async (req, res, next) => {
  try {
    const { name, email, phone, address, isActive, studentIds } = req.body;

    const parent = await User.findOne({ _id: req.params.id, role: 'parent' });
    if (!parent) return res.status(404).json({ success: false, message: 'Parent not found.' });

    if (email && email.trim().toLowerCase() !== parent.email) {
      const duplicate = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: parent._id } });
      if (duplicate) return res.status(409).json({ success: false, message: 'Email already in use.' });
      parent.email = email.trim().toLowerCase();
    }

    if (name !== undefined) parent.name = name;
    if (phone !== undefined) parent.phone = phone;
    if (isActive !== undefined) parent.isActive = isActive;
    if (address !== undefined) {
      parent.address = typeof address === 'string' ? { street: address } : address;
    }

    await parent.save();

    // Synchronize children link
    if (Array.isArray(studentIds)) {
      // 1. Unlink students previously linked to this parent that are not in the new list
      await Student.updateMany(
        { parent: parent._id, _id: { $nin: studentIds } },
        { $set: { parent: null } }
      );

      // 2. Link newly selected students
      if (studentIds.length > 0) {
        await Student.updateMany(
          { _id: { $in: studentIds } },
          {
            $set: {
              parent: parent._id,
              parentName: parent.name,
              parentPhone: parent.phone,
              parentEmail: parent.email,
            },
          }
        );
      }
    }

    const students = await Student.find({ parent: parent._id })
      .populate('user', 'name email')
      .populate('class', 'name section');

    const pObj = parent.toObject();
    pObj.children = students.map((st) => ({
      _id: st._id,
      name: st.user?.name,
      admissionNo: st.admissionNo,
      class: st.class ? `${st.class.name} - ${st.class.section}` : 'Unassigned',
    }));

    return res.status(200).json({ success: true, message: 'Parent updated.', parent: pObj });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/parents/:id — Delete Parent User & Unlink Students
 */
export const deleteParent = async (req, res, next) => {
  try {
    const parent = await User.findOne({ _id: req.params.id, role: 'parent' });
    if (!parent) return res.status(404).json({ success: false, message: 'Parent not found.' });

    // Unlink children
    await Student.updateMany({ parent: parent._id }, { $set: { parent: null } });

    await User.findByIdAndDelete(parent._id);
    return res.status(200).json({ success: true, message: 'Parent removed and children unlinked.' });
  } catch (error) {
    next(error);
  }
};
