import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide department name'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Please provide department code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    faculty: {
        type: String,
        required: [true, 'Please provide faculty name'],
        trim: true
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

// Index for faster queries
departmentSchema.index({ name: 1 });
departmentSchema.index({ code: 1 });

const Department = mongoose.model('Department', departmentSchema);

export default Department;
