import { TestBed } from '@angular/core/testing';

import { RegistrationReminderService } from './registration-reminder.service';

describe('RegistrationReminderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistrationReminderService = TestBed.get(RegistrationReminderService);
    expect(service).toBeTruthy();
  });
});
