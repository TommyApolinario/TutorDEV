import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderWordsComponent } from './order-words.component';

describe('OrderWordsComponent', () => {
  let component: OrderWordsComponent;
  let fixture: ComponentFixture<OrderWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderWordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
