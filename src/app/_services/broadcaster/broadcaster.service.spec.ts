import {TestBed} from '@angular/core/testing';

import {BroadcasterService} from './broadcaster.service';

describe('BroadcasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BroadcasterService = TestBed.get(BroadcasterService);
    expect(service).toBeTruthy();
  });
});
