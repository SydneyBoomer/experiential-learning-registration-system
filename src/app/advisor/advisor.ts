import {
    Component,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';

import { AdvisorService } from '../services/advisor.service';
import { AdvisorApplication } from '../models/advisor-application';


@Component({
    selector: 'app-advisor',
    imports: [],
    templateUrl: './advisor.html',
    styleUrl: './advisor.css'
})
export class AdvisorComponent implements OnInit {

    pendingApplications: AdvisorApplication[] = [];

    registeredApplications: AdvisorApplication[] = [];


    /*
     * Demo advisor member.
     *
     * Dr. Advisor is user ID 3
     * in the current database.
     */
    advisorId = 3;


    constructor(
        private advisorService: AdvisorService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}


    ngOnInit(): void {

        this.loadPendingApplications();

        this.loadRegisteredApplications();

    }


    /*
     * LOAD APPLICATIONS WAITING
     * FOR ADVISOR APPROVAL
     */
    loadPendingApplications(): void {

        this.advisorService
            .getPendingApplications()
            .subscribe({

                next: applications => {

                    this.pendingApplications =
                        applications;

                    this.changeDetectorRef.detectChanges();

                },

                error: error => {

                    console.error(
                        'Error loading pending advisor applications:',
                        error
                    );

                }

            });

    }


    /*
     * LOAD REGISTERED APPLICATIONS
     */
    loadRegisteredApplications(): void {

        this.advisorService
            .getRegisteredApplications()
            .subscribe({

                next: applications => {

                    this.registeredApplications =
                        applications;

                    this.changeDetectorRef.detectChanges();

                },

                error: error => {

                    console.error(
                        'Error loading registered applications:',
                        error
                    );

                }

            });

    }


    /*
     * APPROVE AN APPLICATION
     */
    approveApplication(
        application: AdvisorApplication
    ): void {

        this.advisorService
            .approveApplication(application.id)
            .subscribe({

                next: () => {

                    this.loadPendingApplications();

                    this.loadRegisteredApplications();

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
     * DENY AN APPLICATION
     */
    denyApplication(
        application: AdvisorApplication
    ): void {

        if (!confirm(`Deny ${application.student}'s registration for "${application.title}"?`)) {
            return;
        }

        this.advisorService
            .denyApplication(application.id)
            .subscribe({

                next: () => {

                    this.loadPendingApplications();

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
                    this.loadPendingApplications();

                }

            });

    }

}