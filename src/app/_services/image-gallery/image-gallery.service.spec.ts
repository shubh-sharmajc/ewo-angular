import {TestBed} from '@angular/core/testing';

import {ImageGalleryService} from './image-gallery.service';

describe('ImageGalleryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageGalleryService = TestBed.get(ImageGalleryService);
    expect(service).toBeTruthy();
  });
});
