import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVideosHelpComponent } from './list-videos-help.component';

describe('ListVideosHelpComponent', () => {
  let component: ListVideosHelpComponent;
  let fixture: ComponentFixture<ListVideosHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListVideosHelpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListVideosHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
