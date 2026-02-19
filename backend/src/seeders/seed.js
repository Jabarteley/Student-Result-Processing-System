import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Session from '../models/Session.js';
import Result from '../models/Result.js';
import GPA from '../models/GPA.js';
import AuditLog from '../models/AuditLog.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding (Simplified)...\n');

        // Connect to database
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing all existing data...');
        await Promise.all([
            User.deleteMany({}),
            Department.deleteMany({}),
            Student.deleteMany({}),
            Course.deleteMany({}),
            Session.deleteMany({}),
            Result.deleteMany({}),
            GPA.deleteMany({}),
            AuditLog.deleteMany({})
        ]);
        console.log('✅ Existing data cleared\n');

        // ==================== CREATE DEPARTMENT ====================
        console.log('� Creating Department...');
        const adminDept = await Department.create({
            name: 'Administration',
            code: 'ADM',
            faculty: 'General Administration',
            description: 'Central Administrative Department',
            isActive: true
        });
        console.log(`✅ Department created: ${adminDept.name} (${adminDept.code})`);

        // ==================== CREATE ADMIN USER ====================
        console.log('� Creating Admin User...');
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@ifatoss.edu.ng',
            password: 'admin123',
            role: 'admin',
            department: adminDept.name
        });
        console.log('✅ Admin created: admin@ifatoss.edu.ng / admin123');

        // ==================== SUMMARY ====================
        console.log('\n═══════════════════════════════════════════');
        console.log('✅ SEEDING COMPLETED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════\n');

        console.log('   Email: admin@ifatoss.edu.ng');
        console.log('   Password: admin123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
