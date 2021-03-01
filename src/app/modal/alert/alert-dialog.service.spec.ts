import { TestBed } from '@angular/core/testing';

import { AlertDialogService } from './alert-dialog.service';

describe('AlertDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertDialogService = TestBed.get(AlertDialogService);
    expect(service).toBeTruthy();
  });
});
