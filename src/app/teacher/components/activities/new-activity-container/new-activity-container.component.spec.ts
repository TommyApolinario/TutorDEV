import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewActivityContainerComponent } from './new-activity-container.component';

describe('NewActivityContainerComponent', () => {
  let component: NewActivityContainerComponent;
  let fixture: ComponentFixture<NewActivityContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewActivityContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewActivityContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
