import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password, role: role || 'student', phone, address });
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);
    const userData = user.toJSON();

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, avatar, address } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already registered.' });
      }
      updates.email = normalizedEmail;
    }
    if (phone !== undefined) updates.phone = phone;
    if (avatar !== undefined) updates.avatar = avatar;
    if (address !== undefined) updates.address = address;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    Object.assign(user, updates);
    await user.save();

    return res.status(200).json({ success: true, message: 'Profile updated.', user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    next(error);
  }
};

/**
 * PUT /api/auth/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const oldPass = req.body.oldPassword || req.body.currentPassword;
    const newPass = req.body.newPassword;

    if (!oldPass || !newPass) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(oldPass);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPass;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh-token
 */
export const refreshToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided.' });
    }

    const oldToken = authHeader.split(' ')[1];
    // Allow expired tokens to be refreshed (ignore expiry)
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET, { ignoreExpiration: true });

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or deactivated.' });
    }

    const newToken = generateToken(user._id);
    return res.status(200).json({ success: true, token: newToken });
  } catch (error) {
    next(error);
  }
};
