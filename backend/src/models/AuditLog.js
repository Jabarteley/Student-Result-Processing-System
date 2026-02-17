import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'CREATE',
            'UPDATE',
            'DELETE',
            'CREATE_USER',
            'UPDATE_USER',
            'DELETE_USER',
            'LOGIN',
            'LOGOUT',
            'UPLOAD_SCORE',
            'SUBMIT_RESULT',
            'APPROVE_RESULT',
            'LOCK_SEMESTER',
            'UNLOCK_SEMESTER',
            'GENERATE_PDF',
            'SEND_EMAIL',
            'RESET_PASSWORD',
            'DEACTIVATE_USER',
            'ACTIVATE_USER'
        ]
    },
    resource: {
        type: String,
        required: true,
        enum: ['User', 'Student', 'Course', 'Result', 'Session', 'GPA', 'System']
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    changes: {
        type: mongoose.Schema.Types.Mixed
    },
    ipAddress: {
        type: String,
        trim: true
    },
    userAgent: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

// Indexes for faster queries
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ resource: 1 });
auditLogSchema.index({ timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
