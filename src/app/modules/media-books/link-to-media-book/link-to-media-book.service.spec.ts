import { TestBed } from '@angular/core/testing';

import { LinkToMediabookService } from './link-to-mediabook.service';

describe('WriteAReviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LinkToMediabookService = TestBed.get(LinkToMediabookService);
    expect(service).toBeTruthy();
  });
});
