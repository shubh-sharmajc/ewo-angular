import {TestBed} from '@angular/core/testing';

import {LocalStorage} from './local-storage.service';

describe('LocalStorageService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service = TestBed.get(LocalStorage);
        expect(service).toBeTruthy();
    });
});
