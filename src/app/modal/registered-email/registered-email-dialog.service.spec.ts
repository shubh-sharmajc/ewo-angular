import {TestBed} from '@angular/core/testing';

import {RegisteredEmailDialogService} from './registered-email-dialog.service';

describe('RegisteredEmailDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegisteredEmailDialogService = TestBed.get(RegisteredEmailDialogService);
    expect(service).toBeTruthy();
  });
});
