import express from 'express';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/projects - Get own projects
router.get('/', protect, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user._id })
            .sort({ order: 1, createdAt: -1 });
        res.json({ projects });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/projects - Create project
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, technologies, liveUrl, githubUrl, image, featured, status } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Project title is required' });
        }

        const projectCount = await Project.countDocuments({ userId: req.user._id });

        const project = await Project.create({
            userId: req.user._id,
            title,
            description: description || '',
            technologies: technologies || [],
            liveUrl: liveUrl || '',
            githubUrl: githubUrl || '',
            image: image || '',
            featured: featured || false,
            status: status || 'active',
            order: projectCount,
        });

        res.status(201).json({ project });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/projects/:id - Update project
router.put('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const { title, description, technologies, liveUrl, githubUrl, image, featured, order, status } = req.body;

        if (title !== undefined) project.title = title;
        if (description !== undefined) project.description = description;
        if (technologies !== undefined) project.technologies = technologies;
        if (liveUrl !== undefined) project.liveUrl = liveUrl;
        if (githubUrl !== undefined) project.githubUrl = githubUrl;
        if (image !== undefined) project.image = image;
        if (featured !== undefined) project.featured = featured;
        if (order !== undefined) project.order = order;
        if (status !== undefined) project.status = status;

        await project.save();
        res.json({ project });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
