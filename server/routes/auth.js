import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, displayName } = req.body;

        if (!username || !email || !password || !displayName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!/^[a-z0-9_-]+$/.test(username.toLowerCase())) {
            return res.status(400).json({ message: 'Username can only contain lowercase letters, numbers, hyphens, and underscores' });
        }

        if (username.length < 3 || username.length > 30) {
            return res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const reserved = ['admin', 'login', 'signup', 'dashboard', 'settings', 'api', 'explore'];
        if (reserved.includes(username.toLowerCase())) {
            return res.status(400).json({ message: 'This username is reserved' });
        }

        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({ message: 'Email already registered' });
            }
            return res.status(400).json({ message: 'Username already taken' });
        }

        const user = await User.create({
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password,
            displayName,
        });

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: user.toPublicJSON(),
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account has been deactivated' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                ...user.toPublicJSON(),
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                ...user.toPublicJSON(),
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized' });
    }
});

// PUT /api/auth/update-account - Update username, email, displayName
router.put('/update-account', protect, async (req, res) => {
    try {
        const { username, email, displayName } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Validate and update username
        if (username && username.toLowerCase() !== user.username) {
            const newUsername = username.toLowerCase();
            if (!/^[a-z0-9_-]+$/.test(newUsername)) {
                return res.status(400).json({ message: 'Username can only contain lowercase letters, numbers, hyphens, and underscores' });
            }
            if (newUsername.length < 3 || newUsername.length > 30) {
                return res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
            }
            const reserved = ['admin', 'login', 'signup', 'dashboard', 'settings', 'api', 'explore'];
            if (reserved.includes(newUsername)) {
                return res.status(400).json({ message: 'This username is reserved' });
            }
            const existing = await User.findOne({ username: newUsername });
            if (existing) return res.status(400).json({ message: 'Username already taken' });
            user.username = newUsername;
        }

        // Validate and update email
        if (email && email.toLowerCase() !== user.email) {
            const existing = await User.findOne({ email: email.toLowerCase() });
            if (existing) return res.status(400).json({ message: 'Email already registered' });
            user.email = email.toLowerCase();
        }

        // Update displayName
        if (displayName !== undefined) {
            user.displayName = displayName;
        }

        await user.save();

        res.json({
            message: 'Account updated successfully',
            user: {
                ...user.toPublicJSON(),
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Update account error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/auth/change-password - Change password
router.put('/change-password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
