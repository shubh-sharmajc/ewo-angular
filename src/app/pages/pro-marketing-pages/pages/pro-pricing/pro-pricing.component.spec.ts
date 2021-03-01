import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProPricingComponent } from './pro-pricing.component';

describe('ProPricingComponent', () => {
  let component: ProPricingComponent;
  let fixture: ComponentFixture<ProPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
