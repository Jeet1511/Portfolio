import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

async function promoteAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find and promote user
        const user = await User.findOneAndUpdate(
            { username: 'jeet1511' },
            { role: 'admin' },
            { new: true }
        );

        if (user) {
            console.log(`✅ User "${user.displayName}" (@${user.username}) promoted to admin!`);
        } else {
            // Try finding any user
            const anyUser = await User.findOne();
            if (anyUser) {
                const promoted = await User.findByIdAndUpdate(anyUser._id, { role: 'admin' }, { new: true });
                console.log(`✅ User "${promoted.displayName}" (@${promoted.username}) promoted to admin!`);
            } else {
                console.log('❌ No users found in database');
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

promoteAdmin();
