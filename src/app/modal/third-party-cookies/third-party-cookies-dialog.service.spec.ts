import {TestBed} from '@angular/core/testing';

import {ThirdPartyCookiesDialogService} from './third-party-cookies-dialog.service';

describe('ThirdPartyCookiesDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThirdPartyCookiesDialogService = TestBed.get(ThirdPartyCookiesDialogService);
    expect(service).toBeTruthy();
  });
});
