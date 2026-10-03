import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { ResearchOpportunity } from '../models/research-opportunity';

export interface NewOpportunity {
  title: string;
  description: string;
  type: 'RESEARCH' | 'TA';
  professorId: number;
  department: string;
  capacity: number;
  requirements?: string;
  field?: string;
  subfield?: string;
  semester?: string;
  format?: string;
  datesOffered?: string;
  timeBlock?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResearchOpportunityService {

  private apiUrl =
    'http://localhost:3000/api/opportunities';

  constructor(
    private http: HttpClient
  ) {}

  getAllOpportunities(): Observable<ResearchOpportunity[]> {

    return this.http.get<any[]>(
        this.apiUrl
    ).pipe(
        map(opportunities =>
            opportunities.map(opportunity => ({
                ...opportunity,
                datesOffered: opportunity.dates_offered,
                timeBlock: opportunity.time_block
            }))
        )
    );
}

  createOpportunity(
    opportunity: NewOpportunity
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      opportunity
    );
  }

  getOpportunity(
    id: number
  ): Observable<ResearchOpportunity> {

    return this.http.get<ResearchOpportunity>(
      `${this.apiUrl}/${id}`
    );
  }

}