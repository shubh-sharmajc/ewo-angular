import { TestBed } from '@angular/core/testing';

import { WarningReminderService } from './warning-reminder.service';

describe('PauseRegistrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WarningReminderService = TestBed.get(WarningReminderService);
    expect(service).toBeTruthy();
  });
});
