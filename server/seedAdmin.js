import Admin from '../models/Admin.js';

const SUPER_ADMIN_EMAIL = 'jeet@gmail.com';
const SUPER_ADMIN_PASSWORD = 'JEET25802580';
const SUPER_ADMIN_NAME = 'Super Admin';

export async function seedSuperAdmin() {
    try {
        const existing = await Admin.findOne({ email: SUPER_ADMIN_EMAIL });
        if (existing) {
            // Ensure existing admin has super_admin role
            if (existing.role !== 'super_admin') {
                existing.role = 'super_admin';
                await existing.save();
                console.log('[EvoQ] Super Admin role confirmed');
            }
            return;
        }

        const superAdmin = new Admin({
            email: SUPER_ADMIN_EMAIL,
            password: SUPER_ADMIN_PASSWORD,
            displayName: SUPER_ADMIN_NAME,
            role: 'super_admin',
        });

        await superAdmin.save();
        console.log('[EvoQ] Super Admin account created (jeet@gmail.com)');
    } catch (error) {
        console.error('[EvoQ] Failed to seed Super Admin:', error.message);
    }
}
