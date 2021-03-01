import {TestBed} from '@angular/core/testing';

import {MediaBookService} from './media-book.service';

describe('MediaBookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MediaBookService = TestBed.get(MediaBookService);
    expect(service).toBeTruthy();
  });
});
