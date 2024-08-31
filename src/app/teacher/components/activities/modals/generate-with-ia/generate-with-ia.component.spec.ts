import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateWithIAComponent } from './generate-with-ia.component';

describe('GenerateWithIAComponent', () => {
  let component: GenerateWithIAComponent;
  let fixture: ComponentFixture<GenerateWithIAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateWithIAComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerateWithIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
