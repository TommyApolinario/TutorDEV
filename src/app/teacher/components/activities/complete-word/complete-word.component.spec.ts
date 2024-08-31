import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteWordComponent } from './complete-word.component';

describe('CompleteWordComponent', () => {
  let component: CompleteWordComponent;
  let fixture: ComponentFixture<CompleteWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteWordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
