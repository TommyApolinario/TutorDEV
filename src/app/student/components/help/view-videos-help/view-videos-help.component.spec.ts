import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVideosHelpComponent } from './view-videos-help.component';

describe('ViewVideosHelpComponent', () => {
  let component: ViewVideosHelpComponent;
  let fixture: ComponentFixture<ViewVideosHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewVideosHelpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewVideosHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
