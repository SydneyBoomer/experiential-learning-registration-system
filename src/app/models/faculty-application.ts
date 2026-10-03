export interface FacultyApplication {
    id: number;
    studentId: number;
    opportunityId: number;
    status: string;
    appliedAt: string;
    student: string;
    title: string;
    type: 'RESEARCH' | 'TA';
    interest?: string;
    experience?: string;
}