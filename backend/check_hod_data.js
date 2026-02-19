import mongoose from 'mongoose';
import Course from './src/models/Course.js';
import User from './src/models/User.js';
import Result from './src/models/Result.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const submittedResults = await Result.find({ status: 'submitted' }).populate('courseId');
        console.log('Submitted Results:', submittedResults.length);

        if (submittedResults.length > 0) {
            submittedResults.forEach((r, i) => {
                if (i < 5) {
                    console.log(`Result ${i}:`);
                    console.log('- Course Code:', r.courseId?.courseCode);
                    console.log('- Course Department:', r.courseId?.department);
                    console.log('- Total:', r.total);
                    console.log('- Grade:', r.grade);
                }
            });
        }

        const hods = await User.find({ role: 'hod' });
        console.log('HODs found:', hods.length);
        hods.forEach(h => {
            console.log(`- HOD: ${h.name}, Department: ${h.department}`);
        });

        const courses = await Course.find();
        console.log('Total Courses:', courses.length);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkData();
