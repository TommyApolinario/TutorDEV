import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesContainerComponent } from './activities-container.component';

describe('ActivitiesContainerComponent', () => {
  let component: ActivitiesContainerComponent;
  let fixture: ComponentFixture<ActivitiesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivitiesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
