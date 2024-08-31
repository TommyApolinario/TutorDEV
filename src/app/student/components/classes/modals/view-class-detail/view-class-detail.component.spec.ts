import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClassDetailComponent } from './view-class-detail.component';

describe('ViewClassDetailComponent', () => {
  let component: ViewClassDetailComponent;
  let fixture: ComponentFixture<ViewClassDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewClassDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewClassDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
