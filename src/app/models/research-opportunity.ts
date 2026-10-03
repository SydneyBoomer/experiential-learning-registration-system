export interface ResearchOpportunity {
  id: number;
  title: string;
  description: string;
  type: 'RESEARCH' | 'TA';
  field: string;
  subfield: string;
  professor: string;
  department: string;
  requirements?: string;
  capacity: number;
  applicantCount: number;
  acceptedCount: number;

  format?: string;
  datesOffered?: string;
  timeBlock?: string;
}