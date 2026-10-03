import { Component, OnInit, ChangeDetectorRef} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ResearchOpportunityService } from '../services/research-opportunity';
import { ApplicationService } from '../services/application.service';

import { ResearchOpportunity } from '../models/research-opportunity';
import { Application } from '../models/application';

import { ResearchOpportunityComponent } from '../research-opportunity/research-opportunity';
import { CapstoneComponent } from '../capstone/capstone';

import { CapstoneService } from '../services/capstone.service';
import { Capstone } from '../models/capstone';

import { TeachingAssistantComponent } from '../teaching-assistant/teaching-assistant';

@Component({
  selector: 'app-about',
  imports: [
    FormsModule,
    ResearchOpportunityComponent,
    CapstoneComponent,
    TeachingAssistantComponent
  ],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent implements OnInit {

  /*
   * -------------------------
   * OPPORTUNITIES
   * -------------------------
   */

  opportunities: ResearchOpportunity[] = [];
  applications: Application[] = [];
  capstones: Capstone[] = [];

  activeTab: 'research' | 'capstone' | 'ta' = 'research';

  /*
   * -------------------------
   * RESEARCH FILTERS
   * -------------------------
   */

  selectedField = '';
  selectedSubfield = '';


  /*
   * -------------------------
   * TA FILTERS
   * -------------------------
   */

  selectedTAProfessor = '';
  selectedTADepartment = '';
  selectedTAFormat = '';
  selectedTATime = '';


  /*
   * -------------------------
   * TEMPORARY TEST STUDENT
   * -------------------------
   */

  studentId = 2;


  constructor(
    private researchOpportunityService: ResearchOpportunityService,
    private applicationService: ApplicationService,
    private capstoneService: CapstoneService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  /*
   * -------------------------
   * INITIALIZATION
   * -------------------------
   */

  ngOnInit(): void {
    this.loadOpportunities();
    this.loadApplications();
    this.loadCapstones();
  }


  /*
   * -------------------------
   * OPPORTUNITIES
   * -------------------------
   */

  /*
   * Load all Research and TA
   * opportunities from the backend.
   */
  loadOpportunities(): void {

    this.researchOpportunityService
      .getAllOpportunities()
      .subscribe({

        next: opportunities => {

          this.opportunities =
            opportunities;

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
   * Get only Research opportunities.
   */
  getResearchOpportunities(): ResearchOpportunity[] {

    return this.opportunities.filter(
      opportunity =>
        opportunity.type === 'RESEARCH'
    );
  }


  /*
   * Get only Teaching Assistant opportunities.
   */
  getTeachingAssistantOpportunities(): ResearchOpportunity[] {

    return this.opportunities.filter(
      opportunity =>
        opportunity.type === 'TA'
    );
  }


  /*
   * -------------------------
   * RESEARCH FILTERS
   * -------------------------
   */

  /*
   * Get all unique Research fields.
   */
  getFields(): string[] {

    return [
      ...new Set(
        this.getResearchOpportunities()
          .map(
            opportunity =>
              opportunity.field
          )
          .filter(
            field => field
          )
      )
    ];
  }


  /*
   * Get subfields based on the
   * selected Research field.
   */
  getFilterSubfields(): string[] {

    if (!this.selectedField) {
      return [];
    }

    return [
      ...new Set(
        this.getResearchOpportunities()
          .filter(
            opportunity =>
              opportunity.field ===
              this.selectedField
          )
          .map(
            opportunity =>
              opportunity.subfield
          )
          .filter(
            subfield => subfield
          )
      )
    ];
  }


  /*
   * Get Research opportunities after
   * applying the selected filters.
   */
  getFilteredResearchOpportunities():
    ResearchOpportunity[] {

    let filtered =
      this.getResearchOpportunities();

    if (this.selectedField) {

      filtered = filtered.filter(
        opportunity =>
          opportunity.field ===
          this.selectedField
      );
    }

    if (this.selectedSubfield) {

      filtered = filtered.filter(
        opportunity =>
          opportunity.subfield ===
          this.selectedSubfield
      );
    }

    return filtered;
  }


  /*
   * Clear the Research filters.
   */
  clearFilters(): void {

    this.selectedField = '';
    this.selectedSubfield = '';
  }


  /*
   * -------------------------
   * TA FILTERS
   * -------------------------
   */

  /*
   * Get all unique TA professors.
   */
  getTAProfessors(): string[] {

    return [
      ...new Set(
        this.getTeachingAssistantOpportunities()
          .map(
            opportunity =>
              opportunity.professor
          )
          .filter(
            professor => professor
          )
      )
    ];
  }


  /*
   * Get all unique TA departments.
   */
  getTADepartments(): string[] {

    return [
      ...new Set(
        this.getTeachingAssistantOpportunities()
          .map(
            opportunity =>
              opportunity.department
          )
          .filter(
            department => department
          )
      )
    ];
  }


  /*
   * Get all unique TA formats.
   */
  getTAFormats(): string[] {

    return [
      ...new Set(
        this.getTeachingAssistantOpportunities()
          .map(
            opportunity =>
              opportunity.format
          )
          .filter(
            (format): format is string =>
            !!format
          )
      )
    ];
  }


  /*
   * Get all unique TA time bloFcks.
   */
  getTATimes(): string[] {

    return [
      ...new Set(
        this.getTeachingAssistantOpportunities()
          .map(
            opportunity =>
              opportunity.timeBlock
          )
          .filter(
            (time): time is string =>
            !!time
          )
      )
    ];
  }


  /*
   * Get TA opportunities after
   * applying the selected filters.
   */
  getFilteredTeachingAssistantOpportunities():
    ResearchOpportunity[] {

    let filtered =
      this.getTeachingAssistantOpportunities();


    if (this.selectedTAProfessor) {

      filtered = filtered.filter(
        opportunity =>
          opportunity.professor ===
          this.selectedTAProfessor
      );
    }


    if (this.selectedTADepartment) {

      filtered = filtered.filter(
        opportunity =>
          opportunity.department ===
          this.selectedTADepartment
      );
    }


    if (this.selectedTAFormat) {

      filtered = filtered.filter(
        opportunity =>
          opportunity.format ===
          this.selectedTAFormat
      );
    }


    if (this.selectedTATime) {

      filtered = filtered.filter(
        opportunity =>
          opportunity.timeBlock ===
          this.selectedTATime
      );
    }


    return filtered;
  }


  /*
   * Clear the TA filters.
   */
  clearTAFilters(): void {

    this.selectedTAProfessor = '';
    this.selectedTADepartment = '';
    this.selectedTAFormat = '';
    this.selectedTATime = '';
  }


  /*
   * -------------------------
   * APPLICATIONS
   * -------------------------
   */

  /*
   * Load this student's applications.
   */
  loadApplications(): void {

    this.applicationService
      .getStudentApplications(
        this.studentId
      )
      .subscribe({

        next: applications => {

          this.applications =
            applications;

          this.changeDetectorRef.detectChanges();
        },

        error: error => {

          console.error(
            'Error loading applications:',
            error
          );

        }

      });
  }


  /*
   * Get applications that are
   * still pending.
   */
  getAppliedOpportunities():
    Application[] {

    return this.applications.filter(
      application =>
        application.status === 'APPLIED' ||
        application.status === 'PROFESSOR_APPROVED'
    );
  }

  getApplicationStatusMessage(
    application: Application
  ): string {

    if (application.status === 'PROFESSOR_APPROVED') {
      return 'Waiting for Advisor Approval';
    }

    return 'Waiting for Professor Approval';
  }


  /*
   * Get opportunities that have
   * been registered.
   */
  getRegisteredOpportunities():
    Application[] {

    return this.applications.filter(
      application =>
        application.status === 'REGISTERED'
    );
  }


  /*
   * -------------------------
   * APPLY
   * -------------------------
   */

  /*
   * Apply for a Research or TA
   * opportunity.
   */
  apply(
    opportunity: ResearchOpportunity
  ): void {

    this.applicationService
      .apply(
        this.studentId,
        opportunity.id
      )
      .subscribe({

        next: () => {

          this.loadApplications();
          this.loadOpportunities();
        },

        error: error => {

          console.error(
            'Error applying for opportunity:',
            error
          );

          if (error.status === 409) {

            alert(
              'You have already applied to this opportunity.'
            );
          }

        }

      });
  }


  /*
   * -------------------------
   * CAPSTONE
   * -------------------------
   */

  /*
   * Load this student's
   * Capstone proposals.
   */
  loadCapstones(): void {

    this.capstoneService
      .getStudentCapstones(this.studentId)
      .subscribe({

        next: capstones => {

          this.capstones =
            capstones;

          this.changeDetectorRef.detectChanges();
        },

        error: error => {

          console.error(
            'Error loading Capstone proposals:',
            error
          );

        }

      });
  }


  /*
   * Check whether the student has
   * already applied to an opportunity.
   */
  hasApplied(
    opportunity: ResearchOpportunity
  ): boolean {

    return this.applications.some(
      application =>
        application.opportunityId ===
          opportunity.id &&
        application.status === 'APPLIED'
    );
  }


  /*
   * -------------------------
   * REMOVE APPLICATION
   * -------------------------
   */

  /*
   * Remove an application.
   */
  removeApplication(
    application: Application
  ): void {

    this.applicationService
      .removeApplication(
        application.id
      )
      .subscribe({

        next: () => {

          this.loadApplications();
          this.loadOpportunities();
        },

        error: error => {

          console.error(
            'Error removing application:',
            error
          );

        }

      });
  }

}