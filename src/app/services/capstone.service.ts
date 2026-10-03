import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Capstone } from '../models/capstone';
import { CapstoneMentor } from '../models/capstone-mentor';
import { FacultyCapstone } from '../models/faculty-capstone';

@Injectable({
  providedIn: 'root'
})
export class CapstoneService {

  private apiUrl =
    'http://localhost:3000/api/capstones';


  constructor(
    private http: HttpClient
  ) {}


  /*
   * GET ALL CAPSTONE DEPARTMENTS
   */
  getDepartments(): Observable<string[]> {

    return this.http.get<string[]>(
      `${this.apiUrl}/departments`
    );
  }


  /*
   * GET CAPSTONE MENTORS
   * FOR A DEPARTMENT
   */
  getMentors(
    department: string
  ): Observable<CapstoneMentor[]> {

    return this.http.get<CapstoneMentor[]>(
      `${this.apiUrl}/mentors`,
      {
        params: {
          department
        }
      }
    );
  }


  /*
   * GET ALL CAPSTONES FOR A STUDENT
   */
  getStudentCapstones(
    studentId: number
  ): Observable<Capstone[]> {

    return this.http.get<Capstone[]>(
      `${this.apiUrl}/student/${studentId}`
    );
  }

  /*
  * GET CAPSTONE REQUESTS FOR A FACULTY MEMBER
  */
  getFacultyCapstoneRequests(
      facultyId: number
  ): Observable<FacultyCapstone[]> {

      return this.http.get<FacultyCapstone[]>(
          `${this.apiUrl}/faculty/${facultyId}`
      );
  }

  approveCapstone(capstoneId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${capstoneId}/approve`,
      {}
    );
  }

  denyCapstone(capstoneId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${capstoneId}/deny`,
      {}
    );
  }


  /*
   * SUBMIT A CAPSTONE PROPOSAL
   */
  submitProposal(
    proposal: {
      studentId: number;
      mentorId: number;
      researchIdea: string;
      specifics: string;
    }
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      proposal
    );
  }

}