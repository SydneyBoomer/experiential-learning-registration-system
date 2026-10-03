import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResearchOpportunity } from './research-opportunity';

describe('ResearchOpportunity', () => {
  let component: ResearchOpportunity;
  let fixture: ComponentFixture<ResearchOpportunity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearchOpportunity],
    }).compileComponents();

    fixture = TestBed.createComponent(ResearchOpportunity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
