import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import adminRoutes from './routes/admin.js';
import adminAuthRoutes from './routes/adminAuth.js';
import uploadRoutes from './routes/upload.js';
import { seedSuperAdmin } from './seedAdmin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Serve React build in production
const clientBuild = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuild));
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientBuild, 'index.html'));
    }
});

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('[EvoQ] Connected to MongoDB');
        await seedSuperAdmin();
    } catch (error) {
        console.warn('[EvoQ] MongoDB connection failed:', error.message);
        console.warn('[EvoQ] Running without database - some features will not work');
    }

    app.listen(PORT, () => {
        console.log(`[EvoQ] Server running on port ${PORT}`);
    });
};

startServer();
