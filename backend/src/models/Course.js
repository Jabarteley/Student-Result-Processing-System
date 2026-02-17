import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: [true, 'Please provide course code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Please provide course title'],
        trim: true
    },
    creditUnit: {
        type: Number,
        required: [true, 'Please provide credit units'],
        min: [1, 'Credit units must be at least 1'],
        max: [6, 'Credit units cannot exceed 6']
    },
    department: {
        type: String,
        required: [true, 'Please provide department'],
        trim: true
    },
    faculty: {
        type: String,
        trim: true
    },
    level: {
        type: Number,
        required: [true, 'Please provide level'],
        enum: [100, 200, 300, 400, 500]
    },
    semester: {
        type: String,
        required: [true, 'Please provide semester'],
        enum: ['First', 'Second']
    },
    lecturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
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
courseSchema.index({ courseCode: 1 });
courseSchema.index({ lecturerId: 1 });
courseSchema.index({ department: 1, level: 1, semester: 1 });

const Course = mongoose.model('Course', courseSchema);

export default Course;
