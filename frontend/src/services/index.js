import api from './api';

export const studentService = {
    getAllStudents: async (params = {}) => {
        const response = await api.get('/students', { params });
        return response.data;
    },

    getStudentById: async (id) => {
        const response = await api.get(`/students/${id}`);
        return response.data;
    },

    createStudent: async (studentData) => {
        const response = await api.post('/students', studentData);
        return response.data;
    },

    updateStudent: async (id, studentData) => {
        const response = await api.put(`/students/${id}`, studentData);
        return response.data;
    },

    deleteStudent: async (id) => {
        const response = await api.delete(`/students/${id}`);
        return response.data;
    }
};

export const courseService = {
    getAllCourses: async (params = {}) => {
        const response = await api.get('/courses', { params });
        return response.data;
    },

    getCourseById: async (id) => {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },

    createCourse: async (courseData) => {
        const response = await api.post('/courses', courseData);
        return response.data;
    },

    updateCourse: async (id, courseData) => {
        const response = await api.put(`/courses/${id}`, courseData);
        return response.data;
    },

    deleteCourse: async (id) => {
        const response = await api.delete(`/courses/${id}`);
        return response.data;
    },

    getCoursesByLecturer: async (lecturerId) => {
        const response = await api.get(`/courses/lecturer/${lecturerId}`);
        return response.data;
    },

    assignLecturer: async (courseId, lecturerId) => {
        const response = await api.put(`/courses/${courseId}/assign-lecturer`, { lecturerId });
        return response.data;
    }
};

export const resultService = {
    uploadScore: async (scoreData) => {
        const response = await api.post('/results/upload', scoreData);
        return response.data;
    },

    bulkUploadScores: async (formData) => {
        const response = await api.post('/results/bulk-upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    submitResults: async (data) => {
        const response = await api.post('/results/submit', data);
        return response.data;
    },

    approveResults: async (data) => {
        const response = await api.post('/results/approve', data);
        return response.data;
    },

    getResultsByStudent: async (studentId, params = {}) => {
        const response = await api.get(`/results/student/${studentId}`, { params });
        return response.data;
    },

    getResultsByCourse: async (courseId, params = {}) => {
        const response = await api.get(`/results/course/${courseId}`, { params });
        return response.data;
    }
};

export const sessionService = {
    getAllSessions: async () => {
        const response = await api.get('/sessions');
        return response.data;
    },

    getActiveSession: async () => {
        const response = await api.get('/sessions/active');
        return response.data;
    },

    createSession: async (sessionData) => {
        const response = await api.post('/sessions', sessionData);
        return response.data;
    },

    setActiveSession: async (id) => {
        const response = await api.put(`/sessions/${id}/activate`);
        return response.data;
    },

    lockSemester: async (id, semester) => {
        const response = await api.put(`/sessions/${id}/lock-semester`, { semester });
        return response.data;
    },

    unlockSemester: async (id, semester) => {
        const response = await api.put(`/sessions/${id}/unlock-semester`, { semester });
        return response.data;
    }
};

export const dashboardService = {
    getAdminDashboard: async () => {
        const response = await api.get('/dashboard/admin');
        return response.data;
    },

    getLecturerDashboard: async () => {
        const response = await api.get('/dashboard/lecturer');
        return response.data;
    },

    getStudentDashboard: async () => {
        const response = await api.get('/dashboard/student');
        return response.data;
    },

    getHODDashboard: async () => {
        const response = await api.get('/dashboard/hod');
        return response.data;
    }
};
