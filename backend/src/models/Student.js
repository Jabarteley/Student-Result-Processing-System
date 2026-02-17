import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    matricNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Please provide department'],
        trim: true
    },
    faculty: {
        type: String,
        required: [true, 'Please provide faculty'],
        trim: true
    },
    level: {
        type: Number,
        required: [true, 'Please provide level'],
        enum: [100, 200, 300, 400, 500]
    },
    sessionAdmitted: {
        type: String,
        required: [true, 'Please provide admission session'],
        trim: true
    },
    admissionYear: {
        type: Number,
        required: [true, 'Please provide admission year']
    },
    status: {
        type: String,
        enum: ['active', 'graduated', 'suspended', 'withdrawn'],
        default: 'active'
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for faster queries
studentSchema.index({ matricNumber: 1 });
studentSchema.index({ userId: 1 });
studentSchema.index({ department: 1, level: 1 });
studentSchema.index({ status: 1 });

// Virtual populate for results
studentSchema.virtual('results', {
    ref: 'Result',
    localField: '_id',
    foreignField: 'studentId'
});

// Static method to generate matric number
studentSchema.statics.generateMatricNumber = async function (department, year) {
    // Format: DEPT/YEAR/SEQUENCE (e.g., CSC/2024/001)
    const deptCode = department.substring(0, 3).toUpperCase();

    // Find the last student in this department for this year
    const lastStudent = await this.findOne({
        matricNumber: new RegExp(`^${deptCode}/${year}/`)
    }).sort({ matricNumber: -1 });

    let sequence = 1;
    if (lastStudent) {
        const lastSequence = parseInt(lastStudent.matricNumber.split('/')[2]);
        sequence = lastSequence + 1;
    }

    const sequenceStr = sequence.toString().padStart(3, '0');
    return `${deptCode}/${year}/${sequenceStr}`;
};

const Student = mongoose.model('Student', studentSchema);

export default Student;
