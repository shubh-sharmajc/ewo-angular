import {TestBed} from '@angular/core/testing';

import {SignUpPopupTimerService} from './sign-up-popup-timer.service';

describe('SignUpPopupTimerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SignUpPopupTimerService = TestBed.get(SignUpPopupTimerService);
    expect(service).toBeTruthy();
  });
});
