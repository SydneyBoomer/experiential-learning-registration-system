export interface Capstone {
  id: number;
  studentId: number;
  mentorId: number;
  mentorName: string;
  department: string;
  researchIdea: string;
  specifics: string;
  status: 'SUBMITTED' | 'APPROVED';
  createdAt: string;
  submittedAt: string;
}