import {Inject, Injectable, OnDestroy, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {HttpClient} from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common';
import {Subject} from 'rxjs';
import * as op from 'object-path';

import {PRO_USER_ROLES, USER_ROLES} from '../constant';
import {AuthService} from '../_services/auth/auth.service';
import {environment} from '../../environments/environment';
import {UserService} from '../_services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnDestroy {

  public destroy$: any = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) private platformId,
              private store: Store<any>,
              private http: HttpClient,
              private router: Router,
              private _auth: AuthService,
              private userService: UserService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.fnCheckAuthenticate(next, state);
  }

  /**
   * check Authenticate.
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   */
  private fnCheckAuthenticate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (isPlatformBrowser(this.platformId)) {
      return new Promise(async (resolve) => {
        if (this._auth.getToken() && !this._auth.isTokenExpired()) {
          const data: any = this._auth.getTokenData();
          const username: string = next.parent.params['username'];
          const id: string = next.params['id'];
          const tab: string = next.params['tab'];
          let user: any;
          let role: string;
          if (next && next.data && next.data.roles && next.data.roles.indexOf(data.role) > -1) {
            switch (state.url.split('?')[0]) {
              case `/user/${username}`:
              case `/user/${username}/my-reviews`:
                user = await this.userService.getUserByUserName(username);
                role = user && user.data && user.data.role;
                if (USER_ROLES.indexOf(role) > -1) {
                  return resolve(true);
                } else if (PRO_USER_ROLES.indexOf(role) > -1) {
                  this.router.navigate([`pro${state.url}`]);
                  return false;
                } else {
                  this.gotToHome();
                  return false;
                }
              case `/user/${username}/mediabooks`:
              case `/user/${username}/mediabooks/search`:
              case `/user/${username}/mediabooks/${id}/items`:
              case `/user/${username}/mediabooks/${id}/upload`:
              case `/user/${username}/mediabooks/${id}/mb-sequence`:
                user = await this.userService.getUserByUserName(username);
                role = user && user.data && user.data.role;
                if (USER_ROLES.indexOf(role) > -1) {
                  return resolve(true);
                } else if (PRO_USER_ROLES.indexOf(role) > -1) {
                  this.router.navigate([state.url.replace(`/user`, `/pro/manage-media`)]);
                  return false;
                } else {
                  this.gotToHome();
                  return false;
                }
              case `/user/${username}/edit-profile`:
                await this.userService.getUserByUserName(username);
                if (data && data.username !== username) {
                  this.router.navigate([state.url.replace(`${username}/edit-profile`, `${data.username}/edit-profile`)]);
                  return false;
                } else {
                  return resolve(true);
                }
              case `/pro/user/${username}`:
              case `/pro/user/${username}/review`:
              case `/pro/user/${username}/mediabooks`:
              case `/pro/user/${username}/mediabooks/${id}/items`:
                user = await this.userService.getUserByUserName(username);
                role = user && user.data && user.data.role;
                if (PRO_USER_ROLES.indexOf(role) > -1) {
                  if (!this.gotResumeRegistration(user)) {
                    return false;
                  }
                  return resolve(true);
                } else if (USER_ROLES.indexOf(role) > -1) {
                  this.router.navigate([state.url.replace(`/pro/`, ``)]);
                  return false;
                } else {
                  this.gotToHome();
                  return false;
                }
              case `/pro/manage-media/${username}/mediabooks`:
              case `/pro/manage-media/${username}/mediabooks/search`:
              case `/pro/manage-media/${username}/mediabooks/${id}/items`:
              case `/pro/manage-media/${username}/mediabooks/${id}/upload`:
              case `/pro/manage-media/${username}/mediabooks/${id}/mb-sequence`:
                user = await this.userService.getUserByUserName(username);
                role = user && user.data && user.data.role;
                if (PRO_USER_ROLES.indexOf(role) > -1) {
                  if (!this.gotResumeRegistration(user)) {
                    return false;
                  }
                  return resolve(true);
                } else if (USER_ROLES.indexOf(role) > -1) {
                  this.router.navigate([state.url.replace(`/pro/manage-media`, `user`)]);
                  return false;
                } else {
                  this.gotToHome();
                  return false;
                }
              case `/pro/account`:
              case `/pro/account/${tab}`:
                user = await this.userService.getUserByUserName(data.username);
                role = user && user.data && user.data.role;
                if (PRO_USER_ROLES.indexOf(role) > -1) {
                  if (!this.gotResumeRegistration(user)) {
                    return false;
                  }
                }
                return resolve(true);
              case `/pro/resume-registration`:
                user = await this.userService.getUserByUserName(data.username);
                role = user && user.data && user.data.role;
                if (PRO_USER_ROLES.indexOf(role) > -1) {
                  const business: any = op.get(user, 'data.business');
                  const is_complete = op.get(business, 'is_complete');
                  if (business && is_complete) {
                    window.location.href = `${environment.SITE_URL}/pro/account`;
                    return false;
                  }
                }
                return resolve(true);
              default:
                return resolve(true);
            }
          } else {
            this.gotToHome();
            return false;
          }
        }

        this._auth.removeToken();
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/signin'], {queryParams: {returnUrl: state.url}});
        return false;
      });
    }
    return true;
  }

  private gotToHome() {
    this.router.navigate(['/']);
  }

  private gotResumeRegistration(user: any) {
    const business: any = op.get(user, 'data.business');
    const is_complete = op.get(business, 'is_complete');
    if (!is_complete) {
      window.location.href = `${environment.SITE_URL}/pro/resume-registration`;
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
