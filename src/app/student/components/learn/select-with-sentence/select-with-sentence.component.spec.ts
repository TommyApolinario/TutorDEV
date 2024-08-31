import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWithSentenceComponent } from './select-with-sentence.component';

describe('SelectWithSentenceComponent', () => {
  let component: SelectWithSentenceComponent;
  let fixture: ComponentFixture<SelectWithSentenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectWithSentenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectWithSentenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
