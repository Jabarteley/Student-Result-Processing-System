/**
 * Calculate grade and grade point based on total score
 * @param {Number} total - Total score (CA + Exam)
 * @returns {Object} - { grade, point }
 */
export const calculateGrade = (total) => {
    if (total >= 70) return { grade: 'A', point: 5 };
    if (total >= 60) return { grade: 'B', point: 4 };
    if (total >= 50) return { grade: 'C', point: 3 };
    if (total >= 45) return { grade: 'D', point: 2 };
    if (total >= 40) return { grade: 'E', point: 1 };
    return { grade: 'F', point: 0 };
};
