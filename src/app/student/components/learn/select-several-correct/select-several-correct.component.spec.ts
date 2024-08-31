import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSeveralCorrectComponent } from './select-several-correct.component';

describe('SelectSeveralCorrectComponent', () => {
  let component: SelectSeveralCorrectComponent;
  let fixture: ComponentFixture<SelectSeveralCorrectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSeveralCorrectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectSeveralCorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
