import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishActivityComponent } from './finish-activity.component';

describe('FinishActivityComponent', () => {
  let component: FinishActivityComponent;
  let fixture: ComponentFixture<FinishActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinishActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
