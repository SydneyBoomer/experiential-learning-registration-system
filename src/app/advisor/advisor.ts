import {
    Component,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { AdvisorService } from '../services/advisor.service';
import { ResearchOpportunityService } from '../services/research-opportunity';

import { AdvisorApplication } from '../models/advisor-application';
import { ResearchOpportunity } from '../models/research-opportunity';

type FilterKey =
    'professor' | 'department' | 'field' |
    'subfield' | 'semester' | 'datesOffered' | 'format';

type SortKey = keyof ResearchOpportunity;


@Component({
    selector: 'app-advisor',
    imports: [FormsModule],
    templateUrl: './advisor.html',
    styleUrl: './advisor.css'
})
export class AdvisorComponent implements OnInit {

    pendingApplications: AdvisorApplication[] = [];

    registeredApplications: AdvisorApplication[] = [];

    opportunities: ResearchOpportunity[] = [];


    /*
     * Demo advisor member.
     *
     * Dr. Advisor is user ID 3
     * in the current database.
     */
    advisorId = 3;

    advisorName = 'Alex Johnson';


    /*
     * -------------------------
     * PENDING FILTER
     * -------------------------
     */

    pendingSearch = '';


    /*
     * -------------------------
     * OPPORTUNITY TABLE STATE
     * -------------------------
     */

    oppFilters = {
        search: '',
        type: '',
        professor: '',
        department: '',
        field: '',
        subfield: '',
        semester: '',
        datesOffered: '',
        format: ''
    };

    sortKey: SortKey = 'title';
    sortDir: 1 | -1 = 1;

    openRows = new Set<number>();


    constructor(
        private advisorService: AdvisorService,
        private researchOpportunityService: ResearchOpportunityService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}


    ngOnInit(): void {

        this.loadPendingApplications();

        this.loadRegisteredApplications();

        this.loadOpportunities();

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
     * (shown inside each opportunity's details)
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
     * LOAD EVERY OPPORTUNITY
     */
    loadOpportunities(): void {

        this.researchOpportunityService
            .getAllOpportunities()
            .subscribe({

                next: opportunities => {

                    this.opportunities = opportunities;

                    this.changeDetectorRef.detectChanges();

                },

                error: error => {

                    console.error(
                        'Error loading opportunities:',
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

                    this.reloadAll();

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

                    this.reloadAll();

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

                    this.loadPendingApplications();

                }

            });

    }


    private reloadAll(): void {

        this.loadPendingApplications();
        this.loadRegisteredApplications();
        this.loadOpportunities();

    }


    /*
     * -------------------------
     * PENDING: STUDENT FILTER
     * -------------------------
     */

    getFilteredPending(): AdvisorApplication[] {

        const term = this.pendingSearch.trim().toLowerCase();

        if (!term) {
            return this.pendingApplications;
        }

        return this.pendingApplications.filter(
            application =>
                application.student.toLowerCase().includes(term)
        );

    }


    /*
     * -------------------------
     * OPPORTUNITY TABLE
     * -------------------------
     */

    /* Unique, sorted values for a filter dropdown. */
    getOptions(key: FilterKey): string[] {

        return [
            ...new Set(
                this.opportunities
                    .map(opportunity => opportunity[key] as string | undefined)
                    .filter((value): value is string => !!value)
            )
        ].sort();

    }


    getVisibleOpportunities(): ResearchOpportunity[] {

        const f = this.oppFilters;
        const term = f.search.trim().toLowerCase();

        const filtered = this.opportunities.filter(
            opportunity =>
                (!term || opportunity.title.toLowerCase().includes(term)) &&
                (!f.type || opportunity.type === f.type) &&
                (!f.professor || opportunity.professor === f.professor) &&
                (!f.department || opportunity.department === f.department) &&
                (!f.field || opportunity.field === f.field) &&
                (!f.subfield || opportunity.subfield === f.subfield) &&
                (!f.semester || opportunity.semester === f.semester) &&
                (!f.datesOffered || opportunity.datesOffered === f.datesOffered) &&
                (!f.format || opportunity.format === f.format)
        );

        const key = this.sortKey;
        const dir = this.sortDir;

        return [...filtered].sort((a, b) => {

            const x = a[key] ?? '';
            const y = b[key] ?? '';

            if (typeof x === 'number' && typeof y === 'number') {
                return (x - y) * dir;
            }

            return String(x).localeCompare(String(y)) * dir;

        });

    }


    clearOppFilters(): void {

        this.oppFilters = {
            search: '',
            type: '',
            professor: '',
            department: '',
            field: '',
            subfield: '',
            semester: '',
            datesOffered: '',
            format: ''
        };

    }


    sortBy(key: SortKey): void {

        if (this.sortKey === key) {
            this.sortDir = this.sortDir === 1 ? -1 : 1;
        } else {
            this.sortKey = key;
            this.sortDir = 1;
        }

    }


    sortArrow(key: SortKey): string {

        if (this.sortKey !== key) {
            return '';
        }

        return this.sortDir === 1 ? ' ▲' : ' ▼';

    }


    toggleRow(id: number): void {

        if (this.openRows.has(id)) {
            this.openRows.delete(id);
        } else {
            this.openRows.add(id);
        }

    }


    isRowOpen(id: number): boolean {

        return this.openRows.has(id);

    }


    getRegisteredFor(opportunityId: number): AdvisorApplication[] {

        return this.registeredApplications.filter(
            application => application.opportunityId === opportunityId
        );

    }

}