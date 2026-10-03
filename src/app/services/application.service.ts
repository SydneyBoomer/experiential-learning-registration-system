import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';
import { Application } from '../models/application';
import { FacultyApplication } from '../models/faculty-application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private apiUrl =
    'http://localhost:3000/api/applications';

  constructor(
    private http: HttpClient
  ) {}

  apply(
    studentId: number,
    opportunityId: number
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      {
        studentId,
        opportunityId
      }
    );
  }

  getStudentApplications(
    studentId: number
  ): Observable<Application[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/student/${studentId}`
    ).pipe(
      map(applications =>
        applications.map(application => ({
          id: application.id,
          studentId: application.student_id,
          opportunityId: application.opportunity_id,
          title: application.title,
          description: application.description,
          field: application.field,
          subfield: application.subfield,
          professor: application.professor,
          department: application.department,
          status: application.status,
          appliedAt: application.applied_at,
          professorApprovedAt:
            application.professor_approved_at,
          advisorApprovedAt:
            application.advisor_approved_at
        }))
      )
    );
  }

  removeApplication(
    applicationId: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${applicationId}`
    );
  }

  getProfessorApplications(
      professorId: number
  ): Observable<FacultyApplication[]> {

      return this.http.get<FacultyApplication[]>(
          `${this.apiUrl}/professor/${professorId}`
      );
  }

  approveByProfessor(
      applicationId: number
  ): Observable<any> {

      return this.http.put(
          `${this.apiUrl}/${applicationId}/professor-approve`,
          {}
      );

  }

}