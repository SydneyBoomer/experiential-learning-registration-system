import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { CapstoneService } from '../services/capstone.service';

import { Capstone } from '../models/capstone';
import { CapstoneMentor } from '../models/capstone-mentor';

@Component({
  selector: 'app-capstone',
  imports: [FormsModule],
  templateUrl: './capstone.html',
  styleUrl: './capstone.css'
})
export class CapstoneComponent implements OnInit {

  capstones: Capstone[] = [];

  capstoneDepartments: string[] = [];
  selectedCapstoneDepartment = '';

  capstoneMentors: CapstoneMentor[] = [];
  selectedCapstoneMentor: CapstoneMentor | null = null;

  capstoneResearchIdea = '';
  capstoneSpecifics = '';

  capstoneSubmitted = false;

  studentId = 2;

  constructor(
    private capstoneService: CapstoneService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCapstones();
    this.loadCapstoneDepartments();
  }


  /* =========================================
     CAPSTONE DEPARTMENTS
     ========================================= */

  loadCapstoneDepartments(): void {
    this.capstoneService
      .getDepartments()
      .subscribe({
        next: departments => {
          console.log(
            'CAPSTONE DEPARTMENTS:',
            departments
          );

          this.capstoneDepartments = departments;

          this.changeDetectorRef.detectChanges();
        },

        error: error => {
          console.error(
            'Error loading capstone departments:',
            error
          );
        }
      });
  }


  /* =========================================
     CAPSTONE MENTORS
     ========================================= */

  selectCapstoneDepartment(): void {

    this.selectedCapstoneMentor = null;
    this.capstoneMentors = [];

    if (!this.selectedCapstoneDepartment) {
      return;
    }

    this.capstoneService
      .getMentors(this.selectedCapstoneDepartment)
      .subscribe({
        next: mentors => {
          console.log(
            'CAPSTONE MENTORS:',
            mentors
          );

          this.capstoneMentors = mentors;

          this.changeDetectorRef.detectChanges();
        },

        error: error => {
          console.error(
            'Error loading capstone mentors:',
            error
          );
        }
      });
  }


  selectCapstoneMentor(mentor: CapstoneMentor): void {

    if (this.hasAppliedToMentor(mentor)) {
        return;
    }

    if (
        this.selectedCapstoneMentor?.id === mentor.id
    ) {
        this.selectedCapstoneMentor = null;
        return;
    }

    this.selectedCapstoneMentor = mentor;
}


  /* =========================================
     APPLIED MENTOR CHECK
     ========================================= */

  hasAppliedToMentor(
    mentor: CapstoneMentor
  ): boolean {

    return this.capstones.some(
      capstone =>
        capstone.mentorId === mentor.id
    );
  }


  /* =========================================
     CAPSTONE PROPOSAL
     ========================================= */

  submitCapstoneProposal(): void {

    if (!this.selectedCapstoneMentor) {
      alert(
        'Please select a mentor.'
      );

      return;
    }

    if (!this.capstoneResearchIdea.trim()) {
      alert(
        'Please enter your research idea.'
      );

      return;
    }

    if (!this.capstoneSpecifics.trim()) {
      alert(
        'Please enter a description of your proposed Capstone.'
      );

      return;
    }

    this.capstoneService
      .submitProposal({
        studentId: this.studentId,
        mentorId: this.selectedCapstoneMentor.id,
        researchIdea: this.capstoneResearchIdea,
        specifics: this.capstoneSpecifics
      })
      .subscribe({
        next: () => {

          this.capstoneSubmitted = true;

          this.capstoneResearchIdea = '';
          this.capstoneSpecifics = '';

          this.loadCapstones();

          alert(
            'Capstone proposal submitted successfully.'
          );
        },

        error: error => {
          console.error(
            'Error submitting capstone proposal:',
            error
          );

          alert(
            'There was an error submitting your capstone proposal.'
          );
        }
      });
  }

  clearForm(): void {

    this.capstoneResearchIdea = '';
    this.capstoneSpecifics = '';

}


  /* =========================================
     MY CAPSTONE
     ========================================= */

  loadCapstones(): void {

    this.capstoneService
      .getStudentCapstones(this.studentId)
      .subscribe({
        next: capstones => {

          this.capstones = capstones;

          if (capstones.length > 0) {
            this.capstoneSubmitted = true;
          }

          this.changeDetectorRef.detectChanges();
        },

        error: error => {
          console.error(
            'Error loading capstones:',
            error
          );
        }
      });
  }
}