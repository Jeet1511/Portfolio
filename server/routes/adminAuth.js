import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import ActivityLog from '../models/ActivityLog.js';
import { adminProtect, superAdminOnly } from '../middleware/adminAuth.js';
import os from 'os';

const router = express.Router();

// Helper: generate admin JWT
function generateAdminToken(adminId) {
    return jwt.sign({ id: adminId }, process.env.JWT_SECRET + '_admin', { expiresIn: '8h' });
}

// Helper: log admin activity
async function logActivity(admin, action, targetType, targetId, targetName, details, ip) {
    try {
        await ActivityLog.create({
            action,
            performedBy: admin._id || admin.id,
            performedByName: admin.displayName || admin.email,
            targetType: targetType || 'system',
            targetId: targetId || null,
            targetName: targetName || '',
            details: details || '',
            ip: ip || '',
        });
    } catch (e) { /* silent */ }
}

// ==============================
// AUTH ROUTES (no middleware)
// ==============================

// POST /api/admin-auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!admin.isActive) {
            return res.status(403).json({ message: 'Account has been disabled' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        admin.lastLogin = new Date();
        await admin.save();

        const token = generateAdminToken(admin._id);

        // Log login activity
        await logActivity(admin, 'admin_login', 'admin', admin._id, admin.displayName, 'Admin panel login', req.ip);

        res.json({
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                displayName: admin.displayName,
                role: admin.role,
                lastLogin: admin.lastLogin,
            },
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==============================
// PROTECTED ROUTES (admin auth)
// ==============================

// GET /api/admin-auth/me
router.get('/me', adminProtect, async (req, res) => {
    res.json({
        admin: {
            id: req.admin._id,
            email: req.admin.email,
            displayName: req.admin.displayName,
            role: req.admin.role,
            lastLogin: req.admin.lastLogin,
        },
    });
});

// ==============================
// STATS / DASHBOARD
// ==============================

// GET /api/admin-auth/stats
router.get('/stats', adminProtect, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const totalAdmins = await Admin.countDocuments();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });

        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: thisWeek } });

        const thisMonth = new Date();
        thisMonth.setDate(thisMonth.getDate() - 30);
        const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: thisMonth } });

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('username displayName email createdAt role isActive');

        res.json({
            totalUsers,
            totalProjects,
            activeUsers,
            totalAdmins,
            newUsersToday,
            newUsersThisWeek,
            newUsersThisMonth,
            recentUsers,
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==============================
// USER MANAGEMENT
// ==============================

// GET /api/admin-auth/users
router.get('/users', adminProtect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const status = req.query.status || '';

        let query = {};
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { displayName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        if (status === 'active') query.isActive = true;
        if (status === 'inactive') query.isActive = false;

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const usersWithCount = await Promise.all(
            users.map(async (u) => {
                const projectCount = await Project.countDocuments({ userId: u._id });
                return { ...u.toObject(), projectCount };
            })
        );

        res.json({
            users: usersWithCount,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin-auth/users/:id - Edit user (super admin only)
router.put('/users/:id', adminProtect, superAdminOnly, async (req, res) => {
    try {
        const { displayName, email, isActive } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { ...(displayName && { displayName }), ...(email && { email }), ...(isActive !== undefined && { isActive }) },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/admin-auth/users/:id - Delete user (super admin only)
router.delete('/users/:id', adminProtect, superAdminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await Project.deleteMany({ userId: user._id });
        await User.findByIdAndDelete(req.params.id);

        await logActivity(req.admin, 'user_deleted', 'user', user._id, user.username, `Deleted user @${user.username} and all projects`, req.ip);

        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin-auth/users/:id/toggle - Toggle user status
router.put('/users/:id/toggle', adminProtect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isActive = !user.isActive;
        await user.save();

        await logActivity(req.admin, 'user_toggled', 'user', user._id, user.username, `${user.isActive ? 'Activated' : 'Deactivated'} user @${user.username}`, req.ip);

        res.json({ user: { ...user.toObject(), password: undefined } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==============================
// ADMIN MANAGEMENT (Super Admin)
// ==============================

// GET /api/admin-auth/admins
router.get('/admins', adminProtect, async (req, res) => {
    try {
        const admins = await Admin.find()
            .select('-password')
            .sort({ createdAt: -1 });
        res.json({ admins });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/admin-auth/admins - Add normal admin (super admin only)
router.post('/admins', adminProtect, superAdminOnly, async (req, res) => {
    try {
        const { email, password, displayName } = req.body;
        if (!email || !password || !displayName) {
            return res.status(400).json({ message: 'All fields required' });
        }

        const exists = await Admin.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        const admin = new Admin({
            email: email.toLowerCase(),
            password,
            displayName,
            role: 'admin',
            createdBy: req.admin._id,
        });

        await admin.save();

        await logActivity(req.admin, 'admin_created', 'admin', admin._id, admin.displayName, `Created admin ${admin.email}`, req.ip);

        res.status(201).json({
            admin: {
                id: admin._id,
                email: admin.email,
                displayName: admin.displayName,
                role: admin.role,
                createdAt: admin.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin-auth/admins/:id - Update admin
router.put('/admins/:id', adminProtect, async (req, res) => {
    try {
        // Normal admins can only edit their own profile
        if (req.admin.role !== 'super_admin' && req.admin._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'You can only edit your own profile' });
        }

        const { displayName, email, password, isActive } = req.body;
        const updateData = {};
        if (displayName) updateData.displayName = displayName;
        if (email) updateData.email = email.toLowerCase();
        if (isActive !== undefined && req.admin.role === 'super_admin') {
            updateData.isActive = isActive;
        }

        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        // Cannot modify super admin's role
        if (admin.role === 'super_admin' && req.admin._id.toString() !== admin._id.toString()) {
            return res.status(403).json({ message: 'Cannot modify super admin' });
        }

        Object.assign(admin, updateData);
        if (password) admin.password = password;
        await admin.save();

        res.json({
            admin: {
                id: admin._id,
                email: admin.email,
                displayName: admin.displayName,
                role: admin.role,
                isActive: admin.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/admin-auth/admins/:id - Remove admin (super admin only)
router.delete('/admins/:id', adminProtect, superAdminOnly, async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        if (admin.role === 'super_admin') {
            return res.status(400).json({ message: 'Cannot delete super admin' });
        }

        await Admin.findByIdAndDelete(req.params.id);
        res.json({ message: 'Admin removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==============================
// SERVER MANAGEMENT
// ==============================

// GET /api/admin-auth/server-info
router.get('/server-info', adminProtect, async (req, res) => {
    try {
        const uptime = process.uptime();
        const memUsage = process.memoryUsage();

        res.json({
            hostname: os.hostname(),
            platform: os.platform(),
            arch: os.arch(),
            cpus: os.cpus().length,
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            nodeVersion: process.version,
            uptime: Math.floor(uptime),
            heapUsed: memUsage.heapUsed,
            heapTotal: memUsage.heapTotal,
            rss: memUsage.rss,
            env: process.env.NODE_ENV || 'development',
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==============================
// ANALYTICS
// ==============================

// GET /api/admin-auth/analytics
router.get('/analytics', adminProtect, async (req, res) => {
    try {
        // User growth over last 12 months
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            date.setDate(1);
            date.setHours(0, 0, 0, 0);
            const nextMonth = new Date(date);
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            const count = await User.countDocuments({
                createdAt: { $gte: date, $lt: nextMonth },
            });

            months.push({
                month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                users: count,
            });
        }

        // Top users by project count
        const allUsers = await User.find().select('username displayName').lean();
        const topUsers = await Promise.all(
            allUsers.map(async (u) => ({
                username: u.username,
                displayName: u.displayName,
                projects: await Project.countDocuments({ userId: u._id }),
            }))
        );
        topUsers.sort((a, b) => b.projects - a.projects);

        res.json({
            userGrowth: months,
            topUsers: topUsers.slice(0, 10),
            totalProjects: await Project.countDocuments(),
            totalUsers: await User.countDocuments(),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==============================
// PASSWORD CHANGE
// ==============================

// PUT /api/admin-auth/change-password
router.put('/change-password', adminProtect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const admin = await Admin.findById(req.admin._id);
        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        admin.password = newPassword;
        await admin.save();

        await logActivity(req.admin, 'password_changed', 'admin', req.admin._id, req.admin.displayName, 'Password changed', req.ip);

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==============================
// CONTENT MODERATION
// ==============================

// GET /api/admin-auth/content - List all projects for moderation
router.get('/content', adminProtect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';

        let query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const total = await Project.countDocuments(query);
        const projects = await Project.find(query)
            .populate('userId', 'username displayName email isActive')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            projects: projects.map(p => ({
                id: p._id,
                title: p.title,
                description: p.description,
                image: p.image,
                liveUrl: p.liveUrl,
                githubUrl: p.githubUrl,
                technologies: p.technologies,
                status: p.status,
                featured: p.featured,
                createdAt: p.createdAt,
                owner: p.userId ? {
                    id: p.userId._id,
                    username: p.userId.username,
                    displayName: p.userId.displayName,
                    email: p.userId.email,
                    isActive: p.userId.isActive,
                } : null,
            })),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error('Content moderation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/admin-auth/content/:id - Remove a project
router.delete('/content/:id', adminProtect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('userId', 'username displayName');
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const ownerName = project.userId?.username || 'unknown';
        await Project.findByIdAndDelete(req.params.id);

        await logActivity(req.admin, 'content_removed', 'project', project._id, project.title, `Removed project "${project.title}" by @${ownerName}`, req.ip);

        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin-auth/users/:id/ban - Ban user + remove all content
router.put('/users/:id/ban', adminProtect, superAdminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Deactivate user
        user.isActive = false;
        await user.save();

        // Remove all their projects
        const deletedCount = await Project.countDocuments({ userId: user._id });
        await Project.deleteMany({ userId: user._id });

        await logActivity(req.admin, 'user_banned', 'user', user._id, user.username, `Banned @${user.username} and removed ${deletedCount} projects`, req.ip);

        res.json({ message: `User @${user.username} banned. ${deletedCount} projects removed.` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==============================
// ACTIVITY LOGS
// ==============================

// GET /api/admin-auth/activity-logs
router.get('/activity-logs', adminProtect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const action = req.query.action || '';

        let query = {};
        if (action) query.action = action;

        const total = await ActivityLog.countDocuments(query);
        const logs = await ActivityLog.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            logs,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==============================
// SECURITY - LOGIN ATTEMPTS & BANNED USERS
// ==============================

// GET /api/admin-auth/security
router.get('/security', adminProtect, async (req, res) => {
    try {
        // Recent login activity from activity logs
        const loginLogs = await ActivityLog.find({ action: 'admin_login' })
            .sort({ createdAt: -1 })
            .limit(20);

        // Banned/inactive users
        const bannedUsers = await User.find({ isActive: false })
            .select('username displayName email updatedAt')
            .sort({ updatedAt: -1 });

        // Recent bans from activity logs
        const banLogs = await ActivityLog.find({ action: 'user_banned' })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            loginLogs,
            bannedUsers,
            banLogs,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
