import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    feeType: {
      type: String,
      enum: ['tuition', 'transport', 'hostel', 'sports', 'library', 'other'],
      required: [true, 'Fee type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    paidDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'waived'],
      default: 'pending',
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },
    term: {
      type: String,
      enum: ['Term 1', 'Term 2', 'Term 3', 'Annual'],
      default: 'Term 1',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'cheque', 'online', 'card', 'credit_card', 'debit_card', 'other', ''],
      default: '',
    },
    transactionId: {
      type: String,
      default: '',
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Fee = mongoose.model('Fee', feeSchema);
export default Fee;
