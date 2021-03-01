import {TestBed} from '@angular/core/testing';

import {ProReviewsService} from './pro-reviews.service';

describe('ProReviewsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProReviewsService = TestBed.get(ProReviewsService);
    expect(service).toBeTruthy();
  });
});
