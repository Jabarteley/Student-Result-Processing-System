import mongoose from 'mongoose';

const gpaSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
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
    GPA: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0
    },
    CGPA: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0
    },
    totalCreditUnits: {
        type: Number,
        required: true,
        default: 0
    },
    totalQualityPoints: {
        type: Number,
        required: true,
        default: 0
    },
    cumulativeCreditUnits: {
        type: Number,
        required: true,
        default: 0
    },
    cumulativeQualityPoints: {
        type: Number,
        required: true,
        default: 0
    },
    computedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound unique index
gpaSchema.index({ studentId: 1, session: 1, semester: 1 }, { unique: true });
gpaSchema.index({ studentId: 1 });

const GPA = mongoose.model('GPA', gpaSchema);

export default GPA;
