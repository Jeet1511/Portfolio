import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Protect admin routes - verifies admin JWT token (separate from user tokens)
export const adminProtect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Admin authentication required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET + '_admin');

        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin || !admin.isActive) {
            return res.status(401).json({ message: 'Admin account not found or disabled' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid admin token' });
    }
};

// Super admin only middleware
export const superAdminOnly = (req, res, next) => {
    if (req.admin?.role !== 'super_admin') {
        return res.status(403).json({ message: 'Super admin access required' });
    }
    next();
};
