import {TestBed} from '@angular/core/testing';

import {SignUpDialogService} from './sign-up-dialog.service';

describe('SignUpDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SignUpDialogService = TestBed.get(SignUpDialogService);
    expect(service).toBeTruthy();
  });
});
