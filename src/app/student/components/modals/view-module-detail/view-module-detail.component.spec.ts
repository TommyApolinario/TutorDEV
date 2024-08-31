import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModuleDetailComponent } from './view-module-detail.component';

describe('ViewModuleDetailComponent', () => {
  let component: ViewModuleDetailComponent;
  let fixture: ComponentFixture<ViewModuleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewModuleDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewModuleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
