import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        // e.g. 'admin_login', 'user_banned', 'content_removed', 'admin_created', 'password_changed', etc.
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    performedByName: {
        type: String,
        default: '',
    },
    targetType: {
        type: String,
        enum: ['user', 'project', 'admin', 'system'],
        default: 'system',
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    targetName: {
        type: String,
        default: '',
    },
    details: {
        type: String,
        default: '',
    },
    ip: {
        type: String,
        default: '',
    },
}, { timestamps: true });

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ action: 1 });

export default mongoose.model('ActivityLog', activityLogSchema);
