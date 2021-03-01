import {TestBed} from '@angular/core/testing';

import {GoogleOAuthService} from './google-oauth.service';

describe('GoogleOAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleOAuthService = TestBed.get(GoogleOAuthService);
    expect(service).toBeTruthy();
  });
});
