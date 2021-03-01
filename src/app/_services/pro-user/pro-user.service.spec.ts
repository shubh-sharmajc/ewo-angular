import {TestBed} from '@angular/core/testing';

import {ProUserService} from './pro-user.service';

describe('ProUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProUserService = TestBed.get(ProUserService);
    expect(service).toBeTruthy();
  });
});
