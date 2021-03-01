import {TestBed} from '@angular/core/testing';

import {SaveInMediabookDialogService} from './save-in-mediabook-dialog.service';

describe('SaveInMediabookDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaveInMediabookDialogService = TestBed.get(SaveInMediabookDialogService);
    expect(service).toBeTruthy();
  });
});
