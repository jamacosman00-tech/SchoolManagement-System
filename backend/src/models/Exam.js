import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    examType: {
      type: String,
      enum: ['midterm', 'final', 'quiz', 'assignment'],
      required: [true, 'Exam type is required'],
    },
    date: {
      type: Date,
      required: [true, 'Exam date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    maxMarks: {
      type: Number,
      required: [true, 'Max marks is required'],
      min: 1,
    },
    passingMarks: {
      type: Number,
      required: [true, 'Passing marks is required'],
      min: 0,
    },
    instructions: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
