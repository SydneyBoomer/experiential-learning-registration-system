export interface AdvisorApplication {
    id: number;
    studentId: number;
    opportunityId: number;
    status: string;
    appliedAt: string;

    student: string;
    title: string;
    type: 'RESEARCH' | 'TA';

    professor: string;
    department: string;

    description: string;
    field: string;
    subfield: string;

    professorApprovedAt?: string;
    advisorApprovedAt?: string;
}