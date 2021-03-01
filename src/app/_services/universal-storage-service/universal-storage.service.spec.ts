import {TestBed} from '@angular/core/testing';

import {UniversalStorageService} from './universal-storage.service';
import {CookieModule} from 'ngx-cookie';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {StoreModule} from '@ngrx/store';

describe('UniversalStorageService', () => {
    let service: UniversalStorageService;
    const key = 'test';
    const value = '123456';
    const cookie = 'test=123456';
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot([]),
                CookieModule.forRoot(),
                HttpClientTestingModule,
                RouterTestingModule],
            providers: [UniversalStorageService]
        });
        service = TestBed.get(UniversalStorageService);
    });

    afterEach(() => {
        document.cookie = 'test=';
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the cookie value', () => {
        service.setItem(key, value);
        expect(document.cookie).toEqual(cookie);
    });

    it('should get the cookie value', () => {
        document.cookie = cookie;
        expect(service.getItem(key)).toEqual(value);
    });

    it('should remove the cookie value', () => {
        document.cookie = cookie;
        service.removeItem(key);
        expect(document.cookie).toBe('');
    });

    it('should clear all cookie value', () => {
        document.cookie = cookie;
        service.clear();
        expect(document.cookie).toBe('');
    });
});
