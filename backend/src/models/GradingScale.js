import mongoose from 'mongoose';

const gradingScaleSchema = new mongoose.Schema({
    minScore: {
        type: Number,
        required: [true, 'Minimum score is required'],
        min: 0,
        max: 100
    },
    maxScore: {
        type: Number,
        required: [true, 'Maximum score is required'],
        min: 0,
        max: 100
    },
    grade: {
        type: String,
        required: [true, 'Grade is required'],
        uppercase: true,
        trim: true
    },
    gradePoint: {
        type: Number,
        required: [true, 'Grade point is required'],
        min: 0,
        max: 5
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
gradingScaleSchema.index({ minScore: 1, maxScore: 1 });
gradingScaleSchema.index({ grade: 1 });

// Static method to get grade for a score
gradingScaleSchema.statics.getGradeForScore = async function (score) {
    const gradeScale = await this.findOne({
        minScore: { $lte: score },
        maxScore: { $gte: score },
        isActive: true
    });

    return gradeScale || null;
};

const GradingScale = mongoose.model('GradingScale', gradingScaleSchema);

export default GradingScale;
