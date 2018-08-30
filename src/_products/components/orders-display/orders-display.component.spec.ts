import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersDisplayComponent } from './orders-display.component';

describe('OrdersDisplayComponent', () => {
  let component: OrdersDisplayComponent;
  let fixture: ComponentFixture<OrdersDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
