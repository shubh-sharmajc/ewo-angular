import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BillingAndPaymentsComponent} from './billing-and-payments.component';

describe('BillingAndPaymentsComponent', () => {
  let component: BillingAndPaymentsComponent;
  let fixture: ComponentFixture<BillingAndPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BillingAndPaymentsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingAndPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
