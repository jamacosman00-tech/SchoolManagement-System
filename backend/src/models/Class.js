import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
    },
    section: {
      type: String,
      trim: true,
      default: '',
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      default: null,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

const Class = mongoose.model('Class', classSchema);
export default Class;
