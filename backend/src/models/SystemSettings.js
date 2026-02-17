import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
    hodApprovalRequired: {
        type: Boolean,
        default: false,
        description: 'Require HOD approval before admin can publish results'
    },
    allowResultEdit: {
        type: Boolean,
        default: true,
        description: 'Allow lecturers to edit results before submission'
    },
    currentSession: {
        type: String,
        trim: true,
        description: 'Current active academic session (e.g., 2023/2024)'
    },
    currentSemester: {
        type: String,
        enum: ['First', 'Second'],
        description: 'Current active semester'
    },
    emailNotificationsEnabled: {
        type: Boolean,
        default: false,
        description: 'Enable email notifications for results and updates'
    },
    universityName: {
        type: String,
        default: 'i-FATOSS University, Benin',
        trim: true
    },
    universityLogo: {
        type: String,
        trim: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
systemSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

systemSettingsSchema.statics.updateSettings = async function (updates, userId) {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create(updates);
    } else {
        Object.assign(settings, updates);
        settings.updatedBy = userId;
        await settings.save();
    }
    return settings;
};

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);

export default SystemSettings;
