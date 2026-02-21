import express from 'express';
import User from '../models/User.js';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/stats - Platform analytics
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('username displayName email createdAt role');

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });

        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: thisWeek } });

        res.json({
            stats: {
                totalUsers,
                totalProjects,
                activeUsers,
                newUsersToday,
                newUsersThisWeek,
            },
            recentUsers,
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/admin/users - List all users
router.get('/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';

        const query = search
            ? {
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                    { displayName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const usersWithProjectCount = await Promise.all(
            users.map(async (user) => {
                const projectCount = await Project.countDocuments({ userId: user._id });
                return { ...user.toObject(), projectCount };
            })
        );

        res.json({
            users: usersWithProjectCount,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/users/:id/role - Change user role
router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Admin update role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/users/:id/toggle - Toggle user active status
router.put('/users/:id/toggle', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({ user: { ...user.toObject(), password: undefined } });
    } catch (error) {
        console.error('Admin toggle user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/admin/users/:id - Delete user and their projects
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin users' });
        }

        await Project.deleteMany({ userId: user._id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User and all their projects deleted successfully' });
    } catch (error) {
        console.error('Admin delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
