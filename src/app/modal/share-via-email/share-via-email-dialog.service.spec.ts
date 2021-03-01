import { TestBed } from '@angular/core/testing';

import { ShareViaEmailDialogService } from './share-via-email-dialog.service';

describe('ShareViaEmailDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareViaEmailDialogService = TestBed.get(ShareViaEmailDialogService);
    expect(service).toBeTruthy();
  });
});
