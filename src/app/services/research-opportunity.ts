import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { ResearchOpportunity } from '../models/research-opportunity';

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

  getOpportunity(
    id: number
  ): Observable<ResearchOpportunity> {

    return this.http.get<ResearchOpportunity>(
      `${this.apiUrl}/${id}`
    );
  }

}