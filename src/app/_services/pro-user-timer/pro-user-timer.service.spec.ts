import {TestBed} from '@angular/core/testing';

import {ProUserTimerService} from './pro-user-timer.service';

describe('ProUserTimerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProUserTimerService = TestBed.get(ProUserTimerService);
    expect(service).toBeTruthy();
  });
});
