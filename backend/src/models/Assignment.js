import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  fileUrl: {
    type: String,
    default: '',
  },
  marks: {
    type: Number,
    default: null,
  },
  feedback: {
    type: String,
    default: '',
  },
  isGraded: {
    type: Boolean,
    default: false,
  },
});

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
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
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    maxMarks: {
      type: Number,
      required: [true, 'Max marks is required'],
      min: 1,
    },
    attachments: [
      {
        type: String,
      },
    ],
    submissions: [submissionSchema],
  },
  { timestamps: true }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
