import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUsersDetailComponent } from './view-users-detail.component';

describe('ViewUsersDetailComponent', () => {
  let component: ViewUsersDetailComponent;
  let fixture: ComponentFixture<ViewUsersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewUsersDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewUsersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
