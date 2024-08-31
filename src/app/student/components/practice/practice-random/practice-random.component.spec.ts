import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeRandomComponent } from './practice-random.component';

describe('PracticeRandomComponent', () => {
  let component: PracticeRandomComponent;
  let fixture: ComponentFixture<PracticeRandomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeRandomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PracticeRandomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
