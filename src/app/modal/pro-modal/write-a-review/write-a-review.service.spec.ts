import { TestBed } from '@angular/core/testing';

import { WriteAReviewService } from './write-a-review.service';

describe('WriteAReviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WriteAReviewService = TestBed.get(WriteAReviewService);
    expect(service).toBeTruthy();
  });
});
