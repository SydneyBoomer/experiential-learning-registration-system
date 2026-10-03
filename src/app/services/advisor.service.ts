import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdvisorApplication } from '../models/advisor-application';

@Injectable({
    providedIn: 'root'
})
export class AdvisorService {

    private apiUrl =
        'http://localhost:3000/api/applications';


    constructor(
        private http: HttpClient
    ) {}


    /*
     * GET APPLICATIONS WAITING
     * FOR ADVISOR APPROVAL
     */
    getPendingApplications(): Observable<AdvisorApplication[]> {

        return this.http.get<AdvisorApplication[]>(
            `${this.apiUrl}/advisor/pending`
        );

    }


    /*
     * GET REGISTERED APPLICATIONS
     */
    getRegisteredApplications(): Observable<AdvisorApplication[]> {

        return this.http.get<AdvisorApplication[]>(
            `${this.apiUrl}/advisor/registered`
        );

    }


    /*
     * APPROVE AN APPLICATION
     */
    approveApplication(
        applicationId: number
    ): Observable<any> {

        return this.http.put(
            `${this.apiUrl}/${applicationId}/advisor-approve`,
            {}
        );

    }

    /*
     * DENY AN APPLICATION
     */
    denyApplication(
        applicationId: number
    ): Observable<any> {

        return this.http.put(
            `${this.apiUrl}/${applicationId}/advisor-deny`,
            {}
        );

    }

}