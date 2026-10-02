import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
    qualification: {
      type: String,
      trim: true,
      default: '',
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;
