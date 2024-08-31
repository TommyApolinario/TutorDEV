import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeOptionsComponent } from './practice-options.component';

describe('PracticeOptionsComponent', () => {
  let component: PracticeOptionsComponent;
  let fixture: ComponentFixture<PracticeOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeOptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PracticeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
