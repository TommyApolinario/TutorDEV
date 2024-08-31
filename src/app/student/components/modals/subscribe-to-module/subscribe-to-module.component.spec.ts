import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeToModuleComponent } from './subscribe-to-module.component';

describe('SubscribeToModuleComponent', () => {
  let component: SubscribeToModuleComponent;
  let fixture: ComponentFixture<SubscribeToModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribeToModuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscribeToModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
