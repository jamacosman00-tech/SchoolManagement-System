import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    admissionNo: {
      type: String,
      required: [true, 'Admission number is required'],
      unique: true,
      trim: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      default: null,
    },
    rollNo: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
      default: '',
    },
    parentName: {
      type: String,
      trim: true,
      default: '',
    },
    parentPhone: {
      type: String,
      trim: true,
      default: '',
    },
    parentEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
