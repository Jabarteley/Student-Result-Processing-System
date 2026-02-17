import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide session name'],
        unique: true,
        trim: true
        // Example: "2023/2024"
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide end date']
    },
    isActive: {
        type: Boolean,
        default: false
    },
    semesters: [{
        name: {
            type: String,
            enum: ['First', 'Second'],
            required: true
        },
        isLocked: {
            type: Boolean,
            default: false
        },
        lockedAt: {
            type: Date
        },
        lockedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
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

// Index for faster queries
sessionSchema.index({ name: 1 });
sessionSchema.index({ isActive: 1 });

// Method to lock a semester
sessionSchema.methods.lockSemester = function (semesterName, userId) {
    const semester = this.semesters.find(s => s.name === semesterName);
    if (semester) {
        semester.isLocked = true;
        semester.lockedAt = new Date();
        semester.lockedBy = userId;
    }
    return this.save();
};

// Method to unlock a semester
sessionSchema.methods.unlockSemester = function (semesterName) {
    const semester = this.semesters.find(s => s.name === semesterName);
    if (semester) {
        semester.isLocked = false;
        semester.lockedAt = null;
        semester.lockedBy = null;
    }
    return this.save();
};

// Method to check if semester is locked
sessionSchema.methods.isSemesterLocked = function (semesterName) {
    const semester = this.semesters.find(s => s.name === semesterName);
    return semester ? semester.isLocked : false;
};

const Session = mongoose.model('Session', sessionSchema);

export default Session;
