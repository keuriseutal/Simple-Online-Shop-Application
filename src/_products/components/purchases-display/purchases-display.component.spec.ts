import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesDisplayComponent } from './purchases-display.component';

describe('PurchasesDisplayComponent', () => {
  let component: PurchasesDisplayComponent;
  let fixture: ComponentFixture<PurchasesDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasesDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
