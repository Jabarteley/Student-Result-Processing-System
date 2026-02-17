import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Session from '../models/Session.js';
import Result from '../models/Result.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Connect to database
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Student.deleteMany({});
        await Course.deleteMany({});
        await Session.deleteMany({});
        await Result.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // ==================== CREATE USERS ====================
        console.log('👥 Creating users...');

        // Admin User
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@ifatoss.edu.ng',
            password: 'admin123',
            role: 'admin',
            department: 'Administration'
        });
        console.log('✅ Admin created: admin@ifatoss.edu.ng / admin123');

        // Lecturers
        const lecturer1 = await User.create({
            name: 'Dr. John Smith',
            email: 'john.smith@ifatoss.edu.ng',
            password: 'lecturer123',
            role: 'lecturer',
            department: 'Computer Science'
        });
        console.log('✅ Lecturer created: john.smith@ifatoss.edu.ng / lecturer123');

        const lecturer2 = await User.create({
            name: 'Prof. Sarah Johnson',
            email: 'sarah.johnson@ifatoss.edu.ng',
            password: 'lecturer123',
            role: 'lecturer',
            department: 'Computer Science'
        });
        console.log('✅ Lecturer created: sarah.johnson@ifatoss.edu.ng / lecturer123');

        const lecturer3 = await User.create({
            name: 'Dr. Michael Brown',
            email: 'michael.brown@ifatoss.edu.ng',
            password: 'lecturer123',
            role: 'lecturer',
            department: 'Mathematics'
        });
        console.log('✅ Lecturer created: michael.brown@ifatoss.edu.ng / lecturer123');

        // Students
        const studentUsers = [];
        const studentNames = [
            'Alice Williams', 'Bob Davis', 'Charlie Wilson', 'Diana Moore',
            'Edward Taylor', 'Fiona Anderson', 'George Thomas', 'Hannah Jackson',
            'Isaac White', 'Julia Harris', 'Kevin Martin', 'Laura Thompson'
        ];

        for (let i = 0; i < studentNames.length; i++) {
            const studentUser = await User.create({
                name: studentNames[i],
                email: `student${i + 1}@student.ifatoss.edu.ng`,
                password: 'student123',
                role: 'student',
                department: i < 8 ? 'Computer Science' : 'Mathematics'
            });
            studentUsers.push(studentUser);
        }
        console.log(`✅ ${studentUsers.length} students created (student1-12@student.ifatoss.edu.ng / student123)\n`);

        // ==================== CREATE STUDENTS ====================
        console.log('🎓 Creating student profiles...');

        const students = [];
        const levels = [100, 100, 100, 100, 200, 200, 200, 200, 300, 300, 400, 400];

        for (let i = 0; i < studentUsers.length; i++) {
            const student = await Student.create({
                userId: studentUsers[i]._id,
                department: studentUsers[i].department,
                faculty: 'Science',
                level: levels[i],
                sessionAdmitted: '2023/2024',
                admissionYear: 2023,
                status: 'active'
            });
            students.push(student);
        }
        console.log(`✅ ${students.length} student profiles created\n`);

        // ==================== CREATE SESSION ====================
        console.log('📅 Creating academic session...');

        const session = await Session.create({
            name: '2023/2024',
            startDate: new Date('2023-09-01'),
            endDate: new Date('2024-08-31'),
            isActive: true,
            semesters: {
                first: { isLocked: false },
                second: { isLocked: false }
            }
        });
        console.log(`✅ Session created: ${session.name}\n`);

        // ==================== CREATE COURSES ====================
        console.log('📚 Creating courses...');

        const courses = await Course.insertMany([
            // 100 Level - Computer Science
            {
                courseCode: 'CSC101',
                title: 'Introduction to Computer Science',
                creditUnit: 3,
                department: 'Computer Science',
                level: 100,
                semester: 'First',
                lecturer: lecturer1._id,
                isActive: true
            },
            {
                courseCode: 'CSC102',
                title: 'Introduction to Programming',
                creditUnit: 3,
                department: 'Computer Science',
                level: 100,
                semester: 'First',
                lecturer: lecturer1._id,
                isActive: true
            },
            {
                courseCode: 'MTH101',
                title: 'General Mathematics I',
                creditUnit: 3,
                department: 'Mathematics',
                level: 100,
                semester: 'First',
                lecturer: lecturer3._id,
                isActive: true
            },
            // 200 Level - Computer Science
            {
                courseCode: 'CSC201',
                title: 'Data Structures',
                creditUnit: 3,
                department: 'Computer Science',
                level: 200,
                semester: 'First',
                lecturer: lecturer2._id,
                isActive: true
            },
            {
                courseCode: 'CSC202',
                title: 'Computer Architecture',
                creditUnit: 3,
                department: 'Computer Science',
                level: 200,
                semester: 'First',
                lecturer: lecturer1._id,
                isActive: true
            },
            // 300 Level - Computer Science
            {
                courseCode: 'CSC301',
                title: 'Database Management Systems',
                creditUnit: 3,
                department: 'Computer Science',
                level: 300,
                semester: 'First',
                lecturer: lecturer2._id,
                isActive: true
            },
            {
                courseCode: 'CSC302',
                title: 'Software Engineering',
                creditUnit: 3,
                department: 'Computer Science',
                level: 300,
                semester: 'First',
                lecturer: lecturer1._id,
                isActive: true
            },
            // 400 Level - Computer Science
            {
                courseCode: 'CSC401',
                title: 'Artificial Intelligence',
                creditUnit: 3,
                department: 'Computer Science',
                level: 400,
                semester: 'First',
                lecturer: lecturer2._id,
                isActive: true
            }
        ]);
        console.log(`✅ ${courses.length} courses created\n`);

        // ==================== CREATE RESULTS ====================
        console.log('📊 Creating sample results...');

        const results = [];

        // Create results for each student based on their level
        for (const student of students) {
            const studentCourses = courses.filter(c =>
                c.level === student.level && c.department === student.department
            );

            for (const course of studentCourses) {
                // Generate random scores
                const CA = Math.floor(Math.random() * 31) + 10; // 10-40
                const exam = Math.floor(Math.random() * 51) + 20; // 20-70

                const result = await Result.create({
                    studentId: student._id,
                    courseId: course._id,
                    session: session.name,
                    semester: 'First',
                    CA,
                    exam,
                    status: 'approved',
                    approvedBy: adminUser._id,
                    approvedAt: new Date()
                });
                results.push(result);
            }
        }
        console.log(`✅ ${results.length} results created\n`);

        // ==================== SUMMARY ====================
        console.log('═══════════════════════════════════════════');
        console.log('✅ DATABASE SEEDING COMPLETED!');
        console.log('═══════════════════════════════════════════\n');

        console.log('📋 SUMMARY:');
        console.log(`   Users: ${studentUsers.length + 4}`);
        console.log(`   Students: ${students.length}`);
        console.log(`   Courses: ${courses.length}`);
        console.log(`   Results: ${results.length}`);
        console.log(`   Sessions: 1\n`);

        console.log('🔐 LOGIN CREDENTIALS:\n');
        console.log('   ADMIN:');
        console.log('   Email: admin@ifatoss.edu.ng');
        console.log('   Password: admin123\n');

        console.log('   LECTURERS:');
        console.log('   Email: john.smith@ifatoss.edu.ng');
        console.log('   Email: sarah.johnson@ifatoss.edu.ng');
        console.log('   Email: michael.brown@ifatoss.edu.ng');
        console.log('   Password: lecturer123\n');

        console.log('   STUDENTS:');
        console.log('   Email: student1@student.ifatoss.edu.ng (to student12)');
        console.log('   Password: student123\n');

        console.log('═══════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
