import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeErrorsComponent } from './practice-errors.component';

describe('PracticeErrorsComponent', () => {
  let component: PracticeErrorsComponent;
  let fixture: ComponentFixture<PracticeErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeErrorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PracticeErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
