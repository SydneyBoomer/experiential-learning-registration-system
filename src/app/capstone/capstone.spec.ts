import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Capstone } from './capstone';

describe('Capstone', () => {
  let component: Capstone;
  let fixture: ComponentFixture<Capstone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Capstone],
    }).compileComponents();

    fixture = TestBed.createComponent(Capstone);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
