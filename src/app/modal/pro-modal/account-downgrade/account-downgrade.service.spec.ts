import {TestBed} from '@angular/core/testing';

import {AccountDowngradeService} from './account-downgrade.service';

describe('AccountDowngradeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountDowngradeService = TestBed.get(AccountDowngradeService);
    expect(service).toBeTruthy();
  });
});
