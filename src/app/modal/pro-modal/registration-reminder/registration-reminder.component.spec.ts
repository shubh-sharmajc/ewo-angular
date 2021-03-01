import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegistrationReminderComponent} from './registration-reminder.component';

describe('RegistrationReminderComponent', () => {
  let component: RegistrationReminderComponent;
  let fixture: ComponentFixture<RegistrationReminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationReminderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
