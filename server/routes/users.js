import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Project from '../models/Project.js';
import ProfileView from '../models/ProfileView.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/discover - Discovery feed (paginated, sorted, searchable)
router.get('/discover', async (req, res) => {
    try {
        const { page = 1, limit = 12, search = '', sort = 'likes' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const query = { isActive: { $ne: false } };
        if (search.trim()) {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [
                { username: regex },
                { displayName: regex },
                { bio: regex },
                { skills: regex },
            ];
        }

        let sortOption = {};
        if (sort === 'likes') sortOption = { likeCount: -1, profileViews: -1 };
        else if (sort === 'views') sortOption = { profileViews: -1, likeCount: -1 };
        else if (sort === 'newest') sortOption = { createdAt: -1 };
        else sortOption = { likeCount: -1 };

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password -likes')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get project counts for each user
        const userIds = users.map(u => u._id);
        const projectCounts = await Project.aggregate([
            { $match: { userId: { $in: userIds }, status: 'active' } },
            { $group: { _id: '$userId', count: { $sum: 1 } } },
        ]);
        const countMap = {};
        projectCounts.forEach(pc => { countMap[pc._id.toString()] = pc.count; });

        const enrichedUsers = users.map(u => ({
            id: u._id,
            username: u.username,
            displayName: u.displayName,
            bio: u.bio,
            avatar: u.avatar,
            skills: u.skills,
            socialLinks: u.socialLinks,
            customSocialLinks: u.customSocialLinks || [],
            backgroundStyle: u.backgroundStyle || 'orbs',
            profileViews: u.profileViews,
            likeCount: u.likeCount || 0,
            createdAt: u.createdAt,
            projectCount: countMap[u._id.toString()] || 0,
        }));

        res.json({
            users: enrichedUsers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Discover error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/users/:id/like - Toggle like/unlike
router.post('/:id/like', protect, async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);
        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        if (targetUser._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot like your own profile' });
        }

        const alreadyLiked = targetUser.likes.includes(req.user._id);

        if (alreadyLiked) {
            targetUser.likes.pull(req.user._id);
            targetUser.likeCount = Math.max(0, (targetUser.likeCount || 0) - 1);
        } else {
            targetUser.likes.push(req.user._id);
            targetUser.likeCount = (targetUser.likeCount || 0) + 1;
        }

        await targetUser.save();

        res.json({
            liked: !alreadyLiked,
            likeCount: targetUser.likeCount,
        });
    } catch (error) {
        console.error('Like error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper: fire-and-forget view tracking (non-blocking)
function trackView(req, userId) {
    const visitorIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
        .split(',')[0].trim();

    let isOwner = false;
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
            if (decoded.id && decoded.id.toString() === userId.toString()) {
                isOwner = true;
            }
        } catch { }
    }

    if (!isOwner) {
        // Fire-and-forget: don't await, don't block the response
        ProfileView.create({ profileId: userId, ip: visitorIp })
            .then(() => User.updateOne({ _id: userId }, { $inc: { profileViews: 1 } }))
            .catch(err => {
                if (err.code !== 11000) console.error('View tracking error:', err);
            });
    }
}

// GET /api/users/:username/portfolio - Combined profile + projects (single round-trip)
router.get('/:username/portfolio', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username.toLowerCase(),
            isActive: true,
        }).select('-password -likes').lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch projects in parallel (non-blocking view tracking)
        const projectsPromise = Project.find({
            userId: user._id,
            status: 'active',
        }).sort({ featured: -1, order: 1, createdAt: -1 }).lean();

        // Fire-and-forget view tracking
        trackView(req, user._id);

        const projects = await projectsPromise;

        // Format user for public consumption
        const publicUser = {
            id: user._id,
            username: user.username,
            displayName: user.displayName,
            bio: user.bio,
            avatar: user.avatar,
            skills: user.skills,
            socialLinks: user.socialLinks,
            customSocialLinks: user.customSocialLinks || [],
            backgroundStyle: user.backgroundStyle || 'orbs',
            profileViews: user.profileViews,
            likeCount: user.likeCount || 0,
            createdAt: user.createdAt,
        };

        res.json({ user: publicUser, projects });
    } catch (error) {
        console.error('Get portfolio error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/users/:username - Public profile (legacy, kept for backwards compat)
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username.toLowerCase(),
            isActive: true,
        }).select('-password -likes').lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fire-and-forget view tracking
        trackView(req, user._id);

        const publicUser = {
            id: user._id,
            username: user.username,
            displayName: user.displayName,
            bio: user.bio,
            avatar: user.avatar,
            skills: user.skills,
            socialLinks: user.socialLinks,
            customSocialLinks: user.customSocialLinks || [],
            backgroundStyle: user.backgroundStyle || 'orbs',
            profileViews: user.profileViews,
            likeCount: user.likeCount || 0,
            createdAt: user.createdAt,
        };

        res.json({ user: publicUser });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/users/:username/projects - Public projects (legacy, kept for backwards compat)
router.get('/:username/projects', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username.toLowerCase(),
            isActive: true,
        }).select('_id').lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const projects = await Project.find({
            userId: user._id,
            status: 'active',
        }).sort({ featured: -1, order: 1, createdAt: -1 }).lean();

        res.json({ projects });
    } catch (error) {
        console.error('Get user projects error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/users/profile - Update own profile (auth required)
router.put('/profile/update', protect, async (req, res) => {
    try {
        const { displayName, bio, avatar, skills, socialLinks, customSocialLinks, backgroundStyle } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (displayName !== undefined) user.displayName = displayName;
        if (bio !== undefined) user.bio = bio;
        if (avatar !== undefined) user.avatar = avatar;
        if (skills !== undefined) user.skills = skills;
        if (backgroundStyle !== undefined) user.backgroundStyle = backgroundStyle;
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
