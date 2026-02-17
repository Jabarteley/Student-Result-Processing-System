# Database Seed Data

This document contains all the credentials and data created by the seed script.

## How to Run the Seed Script

```bash
cd backend
npm run seed
```

**⚠️ WARNING:** This will **DELETE ALL EXISTING DATA** and create fresh test data.

---

## Login Credentials

### Admin Account
- **Email:** `admin@ifatoss.edu.ng`
- **Password:** `admin123`
- **Role:** Admin
- **Department:** Administration

### Lecturer Accounts
1. **Dr. John Smith**
   - **Email:** `john.smith@ifatoss.edu.ng`
   - **Password:** `lecturer123`
   - **Department:** Computer Science

2. **Prof. Sarah Johnson**
   - **Email:** `sarah.johnson@ifatoss.edu.ng`
   - **Password:** `lecturer123`
   - **Department:** Computer Science

3. **Dr. Michael Brown**
   - **Email:** `michael.brown@ifatoss.edu.ng`
   - **Password:** `lecturer123`
   - **Department:** Mathematics

### Student Accounts
All students use the password: `student123`

**Computer Science Students:**
- `student1@student.ifatoss.edu.ng` - Alice Williams (100 Level)
- `student2@student.ifatoss.edu.ng` - Bob Davis (100 Level)
- `student3@student.ifatoss.edu.ng` - Charlie Wilson (100 Level)
- `student4@student.ifatoss.edu.ng` - Diana Moore (100 Level)
- `student5@student.ifatoss.edu.ng` - Edward Taylor (200 Level)
- `student6@student.ifatoss.edu.ng` - Fiona Anderson (200 Level)
- `student7@student.ifatoss.edu.ng` - George Thomas (200 Level)
- `student8@student.ifatoss.edu.ng` - Hannah Jackson (200 Level)

**Mathematics Students:**
- `student9@student.ifatoss.edu.ng` - Isaac White (300 Level)
- `student10@student.ifatoss.edu.ng` - Julia Harris (300 Level)
- `student11@student.ifatoss.edu.ng` - Kevin Martin (400 Level)
- `student12@student.ifatoss.edu.ng` - Laura Thompson (400 Level)

---

## Created Data Summary

### Academic Session
- **Name:** 2023/2024
- **Status:** Active
- **Semesters:** Both unlocked

### Courses

**100 Level:**
- CSC101 - Introduction to Computer Science (3 CU) - Dr. John Smith
- CSC102 - Introduction to Programming (3 CU) - Dr. John Smith
- MTH101 - General Mathematics I (3 CU) - Dr. Michael Brown

**200 Level:**
- CSC201 - Data Structures (3 CU) - Prof. Sarah Johnson
- CSC202 - Computer Architecture (3 CU) - Dr. John Smith

**300 Level:**
- CSC301 - Database Management Systems (3 CU) - Prof. Sarah Johnson
- CSC302 - Software Engineering (3 CU) - Dr. John Smith

**400 Level:**
- CSC401 - Artificial Intelligence (3 CU) - Prof. Sarah Johnson

### Results
- Each student has results for all courses in their level and department
- Scores are randomly generated (CA: 10-40, Exam: 20-70)
- All results are **approved** and will show GPA/CGPA calculations

---

## Testing Scenarios

### 1. Admin Dashboard
Login as admin to see:
- Total students: 12
- Total lecturers: 3
- Total courses: 8
- Recent student registrations

### 2. Lecturer Dashboard
Login as any lecturer to see:
- Assigned courses
- Results uploaded
- Pending approvals (will be 0 since all are approved)

### 3. Student Dashboard
Login as any student to see:
- Current GPA and CGPA
- Recent results with grades
- GPA history

### 4. Test Different Levels
- **100 Level:** student1-4 (Computer Science)
- **200 Level:** student5-8 (Computer Science)
- **300 Level:** student9-10 (Mathematics)
- **400 Level:** student11-12 (Mathematics)

---

## Quick Test Commands

### Login as Admin
```
Email: admin@ifatoss.edu.ng
Password: admin123
```

### Login as Lecturer
```
Email: john.smith@ifatoss.edu.ng
Password: lecturer123
```

### Login as Student
```
Email: student1@student.ifatoss.edu.ng
Password: student123
```

---

## Notes

- All matric numbers are auto-generated in format: `DEPT/YEAR/SEQUENCE`
- All results are pre-approved for immediate GPA calculation
- Students are distributed across different levels for comprehensive testing
- Each student has 2-3 courses with results based on their level
