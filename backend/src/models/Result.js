import mongoose from 'mongoose';
import { calculateGrade } from '../utils/gradeCalculator.js';

const resultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    session: {
        type: String,
        required: [true, 'Please provide academic session'],
        trim: true
    },
    semester: {
        type: String,
        required: [true, 'Please provide semester'],
        enum: ['First', 'Second']
    },
    CA: {
        type: Number,
        required: [true, 'Please provide CA score'],
        min: [0, 'CA score cannot be negative'],
        max: [30, 'CA score cannot exceed 30']
    },
    exam: {
        type: Number,
        required: [true, 'Please provide exam score'],
        min: [0, 'Exam score cannot be negative'],
        max: [70, 'Exam score cannot exceed 70']
    },
    total: {
        type: Number,
        min: 0,
        max: 100
    },
    grade: {
        type: String,
        enum: ['A', 'B', 'C', 'D', 'E', 'F']
    },
    gradePoint: {
        type: Number,
        min: 0,
        max: 5
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'hod_approved', 'published', 'rejected'],
        default: 'draft'
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    submittedAt: {
        type: Date
    },
    hodApprovedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    hodApprovedAt: {
        type: Date
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    publishedAt: {
        type: Date
    },
    rejectionReason: {
        type: String,
        trim: true
    },
    remarks: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for faster queries
resultSchema.index({ studentId: 1, session: 1, semester: 1 });
resultSchema.index({ courseId: 1 });
resultSchema.index({ status: 1 });

// Compound unique index to prevent duplicate results
resultSchema.index({ studentId: 1, courseId: 1, session: 1, semester: 1 }, { unique: true });

// Pre-save hook to calculate total, grade, and grade point
resultSchema.pre('save', function (next) {
    // Calculate total
    this.total = this.CA + this.exam;

    // Calculate grade and grade point
    const gradeInfo = calculateGrade(this.total);
    this.grade = gradeInfo.grade;
    this.gradePoint = gradeInfo.point;

    next();
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
