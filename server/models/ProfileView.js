import mongoose from 'mongoose';

const profileViewSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    viewedAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // TTL: auto-delete after 24 hours
    },
});

// Compound index: one view per IP per profile (within TTL window)
profileViewSchema.index({ profileId: 1, ip: 1 }, { unique: true });

export default mongoose.model('ProfileView', profileViewSchema);
