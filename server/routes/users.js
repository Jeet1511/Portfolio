import express from 'express';
import User from '../models/User.js';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/:username - Public profile
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username.toLowerCase(),
            isActive: true,
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Increment profile views
        user.profileViews += 1;
        await user.save();

        res.json({ user: user.toPublicJSON() });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/users/:username/projects - Public projects
router.get('/:username/projects', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username.toLowerCase(),
            isActive: true,
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const projects = await Project.find({
            userId: user._id,
            status: 'active',
        }).sort({ featured: -1, order: 1, createdAt: -1 });

        res.json({ projects });
    } catch (error) {
        console.error('Get user projects error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/users/profile - Update own profile (auth required)
router.put('/profile/update', protect, async (req, res) => {
    try {
        const { displayName, bio, avatar, skills, socialLinks, customSocialLinks } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (displayName !== undefined) user.displayName = displayName;
        if (bio !== undefined) user.bio = bio;
        if (avatar !== undefined) user.avatar = avatar;
        if (skills !== undefined) user.skills = skills;
        if (socialLinks !== undefined) {
            user.socialLinks = { ...user.socialLinks.toObject(), ...socialLinks };
        }
        if (customSocialLinks !== undefined) {
            user.customSocialLinks = customSocialLinks.filter(l => l.label);
        }

        await user.save();

        res.json({
            user: {
                ...user.toPublicJSON(),
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
