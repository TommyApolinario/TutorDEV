import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEvaluationsComponent } from './my-evaluations.component';

describe('MyEvaluationsComponent', () => {
  let component: MyEvaluationsComponent;
  let fixture: ComponentFixture<MyEvaluationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEvaluationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
