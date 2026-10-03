import {
    Component,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';

import { ResearchOpportunityService } from '../services/research-opportunity';
import { ApplicationService } from '../services/application.service';

import { ResearchOpportunity } from '../models/research-opportunity';
import { FacultyApplication } from '../models/faculty-application';

import { FacultyCapstone } from '../models/faculty-capstone';
import { CapstoneService } from '../services/capstone.service';

@Component({
    selector: 'app-faculty',
    imports: [],
    templateUrl: './faculty.html',
    styleUrl: './faculty.css'
})
export class FacultyComponent implements OnInit {

    opportunityFilter: 'ALL' | 'RESEARCH' | 'TA' = 'ALL';
    opportunities: ResearchOpportunity[] = [];
    applications: FacultyApplication[] = [];
    capstoneRequests: FacultyCapstone[] = [];

    /* Applications whose answers are currently expanded. */
    expandedApplications = new Set<number>();

    toggleApplication(id: number): void {
        if (this.expandedApplications.has(id)) {
            this.expandedApplications.delete(id);
        } else {
            this.expandedApplications.add(id);
        }
    }

    isApplicationExpanded(id: number): boolean {
        return this.expandedApplications.has(id);
    }

    /*
     * Demo faculty member.
     *
     * Dr. Smith is user ID 1
     * in the current database.
     */
    facultyId = 1;

    getFilteredOpportunities(): ResearchOpportunity[] {
    if (this.opportunityFilter === 'ALL') {
        return this.opportunities;
    }

    return this.opportunities.filter(
        opportunity => opportunity.type === this.opportunityFilter
    );
}

    constructor(
        private researchOpportunityService: ResearchOpportunityService,
        private applicationService: ApplicationService,
        private capstoneService: CapstoneService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadOpportunities();
        this.loadApplications();
        this.loadCapstoneRequests();
    }


    /*
     * Load all opportunities and keep
     * only the ones belonging to this professor.
     */

    loadOpportunities(): void {
        this.researchOpportunityService.getAllOpportunities().subscribe({
            next: opportunities => {
                this.opportunities = opportunities.filter(
                    opportunity => opportunity.professor === 'Dr. Smith'
                );

                this.changeDetectorRef.detectChanges();
            },
            error: error => {
                console.error('Error loading faculty opportunities:', error);
            }
        });
    }

    loadCapstoneRequests(): void {
        this.capstoneService
            .getFacultyCapstoneRequests(this.facultyId)
            .subscribe({
                next: requests => {
                    this.capstoneRequests = requests;
                    this.changeDetectorRef.detectChanges();
                },
                error: error => {
                    console.error(
                        'Error loading capstone requests:',
                        error
                    );
                }
            });
    }

    getPendingCapstones(): FacultyCapstone[] {
        return this.capstoneRequests.filter(
            request => request.status === 'SUBMITTED'
        );
    }

    getApprovedCapstones(): FacultyCapstone[] {
        return this.capstoneRequests.filter(
            request => request.status === 'APPROVED'
        );
    }

    approveCapstone(request: FacultyCapstone): void {
        this.capstoneService
            .approveCapstone(request.id)
            .subscribe({
                next: () => {
                    this.loadCapstoneRequests();
                },
                error: error => {
                    console.error(
                        'Error approving capstone request:',
                        error
                    );
                }
            });
    }

    denyCapstone(request: FacultyCapstone): void {
        this.capstoneService
            .denyCapstone(request.id)
            .subscribe({
                next: () => {
                    this.loadCapstoneRequests();
                },
                error: error => {
                    console.error(
                        'Error denying capstone request:',
                        error
                    );
                }
            });
    }


    /*
     * Load applications for students.
     *
     * We will use this to show applicants
     * for the professor's opportunities.
     */

    loadApplications(): void {
    this.applicationService.getProfessorApplications(this.facultyId).subscribe({
        next: applications => {
            this.applications = applications;

            this.changeDetectorRef.detectChanges();
        },
        error: error => {
            console.error('Error loading faculty applications:', error);
        }
    });
}

    getPendingApplications(): FacultyApplication[] {
        return this.applications.filter(
            application => application.status === 'APPLIED'
        );
    }

    getApplicantCount(
        opportunityId: number
    ): number {

        return this.applications.filter(
            application =>
                application.opportunityId ===
                opportunityId
        ).length;

    }


    getAcceptedStudents(opportunityId: number): FacultyApplication[] {
        return this.applications.filter(
            application =>
                application.opportunityId === opportunityId &&
                (
                    application.status === 'PROFESSOR_APPROVED' ||
                    application.status === 'REGISTERED'
                )
        );
    }

    /*
     * Approve a student's application.
     */

    approveApplication(application: FacultyApplication): void {

        this.applicationService
            .approveByProfessor(application.id)
            .subscribe({
                next: () => {

                    this.loadApplications();
                    this.loadOpportunities();

                },
                error: error => {
                    console.error(
                        'Error approving application:',
                        error
                    );
                }
            });
    }

    /*
     * Deny a student's application.
     */

    denyApplication(application: FacultyApplication): void {

        if (!confirm(`Deny ${application.student}'s application to "${application.title}"?`)) {
            return;
        }

        this.applicationService
            .denyByProfessor(application.id)
            .subscribe({
                next: () => {

                    this.loadApplications();
                    this.loadOpportunities();

                },
                error: error => {
                    console.error(
                        'Error denying application:',
                        error
                    );

                    alert(
                        error?.error?.error ||
                        `Could not deny the application (HTTP ${error.status}).`
                    );

                    // Re-sync in case the page was showing stale data.
                    this.loadApplications();
                }
            });
    }

}