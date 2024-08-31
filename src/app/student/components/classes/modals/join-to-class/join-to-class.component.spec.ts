import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinToClassComponent } from './join-to-class.component';

describe('JoinToClassComponent', () => {
  let component: JoinToClassComponent;
  let fixture: ComponentFixture<JoinToClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinToClassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoinToClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
