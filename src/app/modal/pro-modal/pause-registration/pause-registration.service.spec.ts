import { TestBed } from '@angular/core/testing';

import { PauseRegistrationService } from './pause-registration.service';

describe('PauseRegistrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PauseRegistrationService = TestBed.get(PauseRegistrationService);
    expect(service).toBeTruthy();
  });
});
