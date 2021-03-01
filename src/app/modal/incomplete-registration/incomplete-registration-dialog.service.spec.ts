import {TestBed} from '@angular/core/testing';

import {IncompleteRegistrationDialogService} from './incomplete-registration-dialog.service';

describe('IncompleteRegistrationDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncompleteRegistrationDialogService = TestBed.get(IncompleteRegistrationDialogService);
    expect(service).toBeTruthy();
  });
});
