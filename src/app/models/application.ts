export interface Application {

  id: number;

  studentId: number;
  opportunityId: number;

  title: string;
  description: string;

  field: string;
  subfield: string;

  professor: string;
  department: string;

  status: string;

  appliedAt: string;

  professorApprovedAt?: string;
  advisorApprovedAt?: string;
}