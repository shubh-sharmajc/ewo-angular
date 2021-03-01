import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WarningReminderComponent} from './warning-reminder.component';

describe('PauseRegistrationComponent', () => {
  let component: WarningReminderComponent;
  let fixture: ComponentFixture<WarningReminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarningReminderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
