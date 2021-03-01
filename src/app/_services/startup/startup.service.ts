import {Inject, Injectable, Injector} from '@angular/core';
import {REQUEST} from '@nguniversal/express-engine/tokens';

import {AuthService} from '../auth/auth.service';
import {GoogleOAuthService} from '../google-oauth/google-oauth.service';

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  constructor(private injector: Injector,
              @Inject(REQUEST) private _req: any) {
  }

  // This is the method you want to call at bootstrap
  // Important: It should return a Promise
  load(): Promise<any> {
    return new Promise(async (resolve: any) => {
      // fix init cookie
      this._req.cookie = this._req.headers['cookie'];

      try {
        if ((<any>window.location.href).includes('p=google')) {
          await this.injector.get(GoogleOAuthService).loadScript();
        } else {
          this.injector.get(GoogleOAuthService).loadScript();
        }
        // Get user data using API call after send cookie to server.
        await this.injector.get(AuthService).getLoginUserData();
        resolve();
      } catch (e) {
        console.error('StartupService -> load ::: ', e);
        resolve();
      }
    });
  }
}
