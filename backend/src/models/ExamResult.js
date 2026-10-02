import mongoose from 'mongoose';

const examResultSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    marksObtained: {
      type: Number,
      default: 0,
      min: 0,
    },
    grade: {
      type: String,
      default: '',
    },
    remarks: {
      type: String,
      default: '',
    },
    isAbsent: {
      type: Boolean,
      default: false,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

// Virtual: percentage (populated from exam's maxMarks)
examResultSchema.virtual('percentage').get(function () {
  if (this._examMaxMarks && this._examMaxMarks > 0) {
    return ((this.marksObtained / this._examMaxMarks) * 100).toFixed(2);
  }
  return null;
});

// Unique per exam + student
examResultSchema.index({ exam: 1, student: 1 }, { unique: true });

// Helper to compute grade from percentage
examResultSchema.statics.computeGrade = function (marks, maxMarks) {
  const pct = (marks / maxMarks) * 100;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
};

const ExamResult = mongoose.model('ExamResult', examResultSchema);
export default ExamResult;
