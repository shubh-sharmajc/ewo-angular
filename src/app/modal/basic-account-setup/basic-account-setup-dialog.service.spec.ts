import {TestBed} from '@angular/core/testing';

import {BasicAccountSetupDialogService} from './basic-account-setup-dialog.service';

describe('BasicAccountSetupDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BasicAccountSetupDialogService = TestBed.get(BasicAccountSetupDialogService);
    expect(service).toBeTruthy();
  });
});
