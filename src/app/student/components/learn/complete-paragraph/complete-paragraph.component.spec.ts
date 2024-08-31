import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteParagraphComponent } from './complete-paragraph.component';

describe('CompleteParagraphComponent', () => {
  let component: CompleteParagraphComponent;
  let fixture: ComponentFixture<CompleteParagraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteParagraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
