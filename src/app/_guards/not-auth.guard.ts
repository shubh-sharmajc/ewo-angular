import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {AuthService} from '../_services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotAuthGuard implements CanActivate {

  constructor(private router: Router, private _auth: AuthService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this._auth.getToken()) {
      return true;
    } else {
      switch (state.url) {
        case `/pro/sign-up`:
          this.router.navigate([`/pro/resume-registration`]);
          return false;
        default:
          this.router.navigate(['/']);
          return false;
      }
    }
  }
}
