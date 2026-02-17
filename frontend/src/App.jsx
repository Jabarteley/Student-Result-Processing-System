import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/auth/Login';
import DashboardLayout from './layouts/DashboardLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserList from './pages/admin/UserList';
import CreateUser from './pages/admin/CreateUser';
import EditUser from './pages/admin/EditUser';
import StudentList from './pages/admin/StudentList';
import CreateStudent from './pages/admin/CreateStudent';
import EditStudent from './pages/admin/EditStudent';
import StudentProfile from './pages/admin/StudentProfile';
import CourseList from './pages/admin/CourseList';
import CreateCourse from './pages/admin/CreateCourse';
import EditCourse from './pages/admin/EditCourse';
import SessionList from './pages/admin/SessionList';
import GradingConfig from './pages/admin/GradingConfig';
import ResultOversight from './pages/admin/ResultOversight';
import Reports from './pages/admin/Reports';
import AuditLogs from './pages/admin/AuditLogs';
import SystemSettings from './pages/admin/SystemSettings';

// Lecturer Pages
import LecturerCourses from './pages/lecturer/LecturerCourses';
import ScoreUpload from './pages/lecturer/ScoreUpload';
import BulkUpload from './pages/lecturer/BulkUpload';
import CourseResults from './pages/lecturer/CourseResults';

// HOD Pages
import HODDashboard from './pages/hod/HODDashboard';
import ResultApproval from './pages/hod/ResultApproval';
import DepartmentReports from './pages/hod/DepartmentReports';
import LecturerManagement from './pages/hod/LecturerManagement';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SemesterResults from './pages/student/SemesterResults';
import CumulativeRecord from './pages/student/CumulativeRecord';
import DownloadResult from './pages/student/DownloadResult';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route element={<DashboardLayout />}>
                        {/* Admin Routes */}
                        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><Navigate to="/admin/dashboard" replace /></ProtectedRoute>} />
                        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><UserList /></ProtectedRoute>} />
                        <Route path="/admin/users/create" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><CreateUser /></ProtectedRoute>} />
                        <Route path="/admin/users/edit/:id" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><EditUser /></ProtectedRoute>} />
                        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><StudentList /></ProtectedRoute>} />
                        <Route path="/admin/students/create" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><CreateStudent /></ProtectedRoute>} />
                        <Route path="/admin/students/edit/:id" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><EditStudent /></ProtectedRoute>} />
                        <Route path="/admin/students/profile/:id" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><StudentProfile /></ProtectedRoute>} />
                        <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><CourseList /></ProtectedRoute>} />
                        <Route path="/admin/courses/create" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><CreateCourse /></ProtectedRoute>} />
                        <Route path="/admin/courses/edit/:id" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><EditCourse /></ProtectedRoute>} />
                        <Route path="/admin/sessions" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><SessionList /></ProtectedRoute>} />
                        <Route path="/admin/grading" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><GradingConfig /></ProtectedRoute>} />
                        <Route path="/admin/results" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ResultOversight /></ProtectedRoute>} />
                        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><Reports /></ProtectedRoute>} />
                        <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AuditLogs /></ProtectedRoute>} />
                        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><SystemSettings /></ProtectedRoute>} />

                        {/* Lecturer Routes */}
                        <Route path="/lecturer" element={<ProtectedRoute allowedRoles={['lecturer', 'admin']}><Navigate to="/lecturer/courses" replace /></ProtectedRoute>} />
                        <Route path="/lecturer/courses" element={<ProtectedRoute allowedRoles={['lecturer', 'admin']}><LecturerCourses /></ProtectedRoute>} />
                        <Route path="/lecturer/courses/:courseId" element={<ProtectedRoute allowedRoles={['lecturer', 'admin']}><CourseResults /></ProtectedRoute>} />
                        <Route path="/lecturer/upload-scores/:courseId" element={<ProtectedRoute allowedRoles={['lecturer', 'admin']}><ScoreUpload /></ProtectedRoute>} />
                        <Route path="/lecturer/upload-bulk/:courseId" element={<ProtectedRoute allowedRoles={['lecturer', 'admin']}><BulkUpload /></ProtectedRoute>} />

                        {/* HOD Routes */}
                        <Route path="/hod" element={<ProtectedRoute allowedRoles={['hod', 'admin']}><Navigate to="/hod/dashboard" replace /></ProtectedRoute>} />
                        <Route path="/hod/dashboard" element={<ProtectedRoute allowedRoles={['hod', 'admin']}><HODDashboard /></ProtectedRoute>} />
                        <Route path="/hod/approvals" element={<ProtectedRoute allowedRoles={['hod', 'admin']}><ResultApproval /></ProtectedRoute>} />
                        <Route path="/hod/reports" element={<ProtectedRoute allowedRoles={['hod', 'admin']}><DepartmentReports /></ProtectedRoute>} />
                        <Route path="/hod/lecturers" element={<ProtectedRoute allowedRoles={['hod', 'admin']}><LecturerManagement /></ProtectedRoute>} />

                        {/* Student Routes */}
                        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><Navigate to="/student/dashboard" replace /></ProtectedRoute>} />
                        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                        <Route path="/student/results" element={<ProtectedRoute allowedRoles={['student']}><SemesterResults /></ProtectedRoute>} />
                        <Route path="/student/cumulative-record" element={<ProtectedRoute allowedRoles={['student']}><CumulativeRecord /></ProtectedRoute>} />
                        <Route path="/student/download-results" element={<ProtectedRoute allowedRoles={['student']}><DownloadResult /></ProtectedRoute>} />
                    </Route>

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
