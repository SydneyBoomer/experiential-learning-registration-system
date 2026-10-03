import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeachingAssistant } from './teaching-assistant';

describe('TeachingAssistant', () => {
  let component: TeachingAssistant;
  let fixture: ComponentFixture<TeachingAssistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachingAssistant],
    }).compileComponents();

    fixture = TestBed.createComponent(TeachingAssistant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
