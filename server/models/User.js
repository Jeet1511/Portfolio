import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30,
        match: /^[a-z0-9_-]+$/,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    bio: {
        type: String,
        default: '',
        maxlength: 500,
    },
    avatar: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    skills: [{
        type: String,
        trim: true,
    }],
    socialLinks: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        website: { type: String, default: '' },
        instagram: { type: String, default: '' },
    },
    customSocialLinks: [{
        label: { type: String, required: true, maxlength: 50 },
        url: { type: String, required: true },
    }],
    profileViews: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
    return {
        id: this._id,
        username: this.username,
        displayName: this.displayName,
        bio: this.bio,
        avatar: this.avatar,
        skills: this.skills,
        socialLinks: this.socialLinks,
        customSocialLinks: this.customSocialLinks || [],
        profileViews: this.profileViews,
        createdAt: this.createdAt,
    };
};

export default mongoose.model('User', userSchema);
