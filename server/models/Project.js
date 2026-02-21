import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    description: {
        type: String,
        default: '',
        maxlength: 2000,
    },
    technologies: [{
        type: String,
        trim: true,
    }],
    liveUrl: {
        type: String,
        default: '',
    },
    githubUrl: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    featured: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['active', 'archived', 'draft'],
        default: 'active',
    },
}, { timestamps: true });

projectSchema.index({ userId: 1, order: 1 });

export default mongoose.model('Project', projectSchema);
