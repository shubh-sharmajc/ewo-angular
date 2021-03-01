import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {MatDialog} from '@angular/material';
import * as jwt_decode from 'jwt-decode';
import {Router} from '@angular/router';

import {AuthAPIService} from '../auth-api/auth-api.service';
import {UniversalStorageService} from '../universal-storage-service/universal-storage.service';
import {LoginUserAction} from '../../store/actions/login-action';
import {AppState} from '../../app.state';
import {ConfirmEmailComponent} from '../../modal/confirm-email/confirm-email.component';
import {VerifyEmailService} from '../verify-email/verify-email.service';
import {CompleteRegistrationComponent} from '../../modal/complete-registration/complete-registration.component';
import {NodeBBLoginUserSlugAction} from '../../store/actions/nodebb-action';
import {COOKIE_NAME, USER_ROLES} from '../../constant';
import {AlertDialogService} from '../../modal/alert/alert-dialog.service';
import {ProUserService} from '../pro-user/pro-user.service';
import {GetProUserAction} from '../../store/actions/pro-actioin';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public router: Router,
              private store: Store<AppState>,
              public dialog: MatDialog,
              private authAPI: AuthAPIService,
              private cookies: UniversalStorageService,
              private verifyEmailService: VerifyEmailService,
              private proUserService: ProUserService,
              private alertDialog: AlertDialogService) {
    const _self = this;
    window.addEventListener('storage', function (event) {
      if (event.key === COOKIE_NAME && ['/signin'].indexOf(_self.router.url) === -1) {
        location.reload();
      }
    });
  }

  public async login(payload: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const res: any = await this.epamLogin(payload);
        if (res && res.status === 'success' && res.user) {
          if (res.user.email_verify) {
            await this.nodeBBAndWPLogin(res.token, payload);
            this.setToken(res.token);
            this.setLoggedUserInfo(res.user);
            return resolve(res);
          } else {
            this.openConfirmEmailModal(res.user);
            reject(res);
          }
        } else {
          console.error('AuthService -> login ::: ', res);
          return reject(res);
        }
      } catch (e) {
        console.error('AuthService -> login ::: ', e);
        return reject(e);
      }
    });
  }

  public async socialLogin(payload: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const res: any = await this.epamSocialLogin(payload);
        if (res && res.status === 'success' && res.user) {
          if (res.user.email_verify) {
            return Promise.all([
              this.wpLogin(res.token),
              this.nodeBBLogin(res.token, {email: res.user.email})
            ]).then(() => {
              this.setToken(res.token);
              this.setLoggedUserInfo(res.user);
              return resolve(res);
            }).catch((e) => {
              console.error('AuthService -> socialLogin ::: ', e);
              this.alertDialog.alert('Oh no! Your login temporarily failed, So please try again later.');
              return reject(e);
            });
          } else {
            this.openConfirmEmailModal(res.user);
            reject('Email is not verified.');
          }
        } else {
          console.error('AuthService -> login ::: ', res);
          return reject(res);
        }
      } catch (e) {
        console.error('AuthService -> login ::: ', e);
        return reject(e);
      }
    });
  }

  public async logout() {
    this.nodeBBAndWPLogout();
    if (this.getToken()) {
      await this.epamLogout();
    }
    this.removeToken();
  }

  public async epamLogin(payload) {
    return await this.authAPI.epamLogin(payload);
  }

  public async epamSocialLogin(payload) {
    return await this.authAPI.epamSocialLogin(payload);
  }

  public async epamLogout() {
    return this.authAPI.epamLogout();
  }

  public async nodeBBLogin(token: string, payload: any) {
    return this.authAPI.nodeBBLogin(token, payload.email, payload.password, payload.remember_me);
  }

  public async nodeBBLogout() {
    return this.authAPI.nodeBBLogout();
  }

  public async wpLogin(token: string, remember_me?: any) {
    return this.authAPI.wpLogin(token, remember_me);
  }

  public async wpLogout() {
    return this.authAPI.wpLogout();
  }

  public async nodeBBAndWPLogin(token: string, payload: any) {
    return new Promise(async (resolve, reject) => {
      Promise.all([
        this.nodeBBLogin(token, payload),
        this.wpLogin(token, payload.remember_me)
      ]).then(() => resolve()).catch((e) => reject(e));
    });
  }

  public async nodeBBAndWPLogout() {
    return new Promise(async (resolve, reject) => {
      Promise.all([
        this.nodeBBLogout(),
        this.wpLogout()
      ]).then(() => resolve()).catch((e) => reject(e));
    });
  }

  public async signUp(payload: any) {
    return this.authAPI.signUp(payload);
  }

  public async signUpPro(payload: any) {
    return this.authAPI.signUpPro(payload);
  }

  public async getProUser(Id?) {
    let id: string = Id;
    if (this.getToken()) {
      const data: any = this.getTokenData();
      id = Id ? Id : data && data._id;
    }
    return id && this.proUserService.getProUser(id);
  }

  public async getLoginUserData() {
    if (this.getToken()) {
      return this.authAPI.getLoginUserInfo();
    }
  }

  public async verifyEmailToken(verifyToken, email) {
    return new Promise(async (resolve, reject) => {
      try {
        const res: any = await this.verifyEmailService.verifyEmailToken(verifyToken, email);
        if (res && res.status === 'success') {
          if (res && res.user && res.user.email_verify) {
            return Promise.all([
              this.wpLogin(res.token),
              this.nodeBBLogin(res.token, {email})
            ]).then(() => {
              this.setToken(res.token);
              this.setLoggedUserInfo(res.user);
              if (USER_ROLES.indexOf(res.user) > -1) {
                this.openCompleteRegModal(res);
              }
              return resolve(res);
            }).catch((e) => {
              console.error('AuthService -> verifyEmailToken ::: ', e);
              this.alertDialog.alert('Oh no! Your login temporarily failed, So please try again later.');
              return reject(e);
            });
          } else {
            this.openConfirmEmailModal(res.user);
            return resolve(res);
          }
        } else {
          console.error('AuthService ->  verifyEmailToken ::: ', res);
          this.alertDialog.alert('Email verification link has expired.');
          return reject(res);
        }
      } catch (e) {
        console.error('AuthService ->  verifyEmailToken ::: ', e);
        this.alertDialog.alert('Email verification link has expired.');
        return reject(e);
      }
    });
  }

  private getTokenExpirationDate(token: string): any {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) {
      return null;
    }

    const date: any = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  public isTokenExpired(token?: string): any {
    if (!token) {
      token = this.getToken();
    }
    if (!token) {
      return true;
    }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

  public setLoggedUserInfo(user: any) {
    this.store.dispatch(new LoginUserAction(user));
    this.store.dispatch(new GetProUserAction(user));
  }

  public setNodeBBLoggedUserInfo(data: any) {
    this.store.dispatch(new NodeBBLoginUserSlugAction(data));
  }

  public setToken(authToken: string) {
    if (authToken) {
      const decoded: any = jwt_decode(authToken);
      this.cookies.setItem(COOKIE_NAME, authToken, {expires: new Date(decoded.exp * 1000)});
      localStorage.setItem(COOKIE_NAME, `login_${Date.now()}_${Math.random()}`);
    }
  }

  public getToken(): string {
    const getCookie: any = this.cookies.getItem(COOKIE_NAME);
    // HERE: Path condition  for universal because it get cookie if not available at client side.
    if (getCookie && getCookie.indexOf('path') === -1) {
      return getCookie;
    } else {
      return null;
    }
  }

  public getTokenData() {
    return this.getToken() ? jwt_decode(this.getToken()) : null;
  }

  public removeToken() {
    this.setLoggedUserInfo(null);
    this.setNodeBBLoggedUserInfo(null);
    this.cookies.removeItem(COOKIE_NAME);
    localStorage.setItem(COOKIE_NAME, `logout_${Date.now()}_${Math.random()}`);
  }

  public openConfirmEmailModal(user: any) {
    this.dialog.open(ConfirmEmailComponent, {
      disableClose: true,
      height: '275px',
      width: '732px',
      panelClass: 'confirm-email-dialog',
      data: user
    });
  }

  public openCompleteRegModal(data: any) {
    this.dialog.open(CompleteRegistrationComponent, {
      disableClose: true,
      width: '520px',
      height: '340px',
      panelClass: 'finish-registration-dialog',
      data: data
    });
  }
}
