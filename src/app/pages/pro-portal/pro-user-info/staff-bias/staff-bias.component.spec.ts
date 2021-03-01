import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StaffBiasComponent} from './staff-bias.component';

describe('AccountSecurityComponent', () => {
  let component: StaffBiasComponent;
  let fixture: ComponentFixture<StaffBiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StaffBiasComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffBiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
