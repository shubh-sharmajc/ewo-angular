import { TestBed } from '@angular/core/testing';

import { FlagReviewService } from './flag-review.service';

describe('ContactUsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlagReviewService = TestBed.get(FlagReviewService);
    expect(service).toBeTruthy();
  });
});
