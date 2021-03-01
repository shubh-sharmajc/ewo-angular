import {TestBed} from '@angular/core/testing';

import {MediaBookItemsService} from './media-book-items.service';

describe('MediaBookItemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MediaBookItemsService = TestBed.get(MediaBookItemsService);
    expect(service).toBeTruthy();
  });
});
