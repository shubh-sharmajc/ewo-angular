import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';

import {environment} from '../../../environments/environment';
import {AppState} from '../../app.state';
import {LoginUserAction, LogoutUserAction} from '../../store/actions/login-action';
import {GetProUserAction} from '../../store/actions/pro-actioin';

@Injectable({
  providedIn: 'root'
})
export class AuthAPIService {

  constructor(private store: Store<AppState>,
              private http: HttpClient) {
  }

  public epamLogin(payload: any) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/api/login`, payload)
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  public epamSocialLogin(payload: any) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/api/auth/social`, payload)
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  public nodeBBLogin(token: any, email: any, pass?: any, remember_me?: any) {
    const remember: any = remember_me ? 720 : 24;
    const API_URL: any = `${environment.DISSCUSSION_LINK}loginhidden`;
    let FULL_URL: any = `${API_URL}?auth_token=${token.replace(/ /gi, '%')}&hash1=${btoa(email)}`;
    if (pass) {
      FULL_URL += `&hash2=${btoa(pass)}`;
    }
    if (remember) {
      FULL_URL += `&hash3=${remember}`;
    }
    return this.iframeAuth(FULL_URL);
  }

  public wpLogin(token: any, remember_me?: any) {
    const remember: any = remember_me ? 720 : 24;
    const API_URL: any = `${environment.WP_LINK}wp-apis.php`;
    const FULL_URL: any = `${API_URL}?type=user_login&token=${token}&remember_me=${remember}`;
    return this.iframeAuth(FULL_URL);
  }

  public epamLogout() {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/api/logout`, {})
        .subscribe((res) => {
          this.store.dispatch(new LogoutUserAction(null));
          resolve(res);
        }, (e: any) => reject(e));
    });
  }

  public nodeBBLogout() {
    const API_URL: any = `${environment.DISSCUSSION_LINK}logouthidden`;
    return this.iframeAuth(API_URL);
  }

  public wpLogout() {
    const API_URL: any = `${environment.WP_LINK}wp-apis.php?type=logout`;
    return this.iframeAuth(API_URL);
  }

  public signUp(payload: any) {
    const formData: any = new FormData();
    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        formData.append(key, payload[key]);
      }
    }
    formData.append('role', 'author');
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/user/register`, formData)
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  public signUpPro(payload: any) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/user/pro/register`, payload)
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  public getLoginUserInfo() {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/user-detail`, {}, {})
        .subscribe((res: any) => {
          this.store.dispatch(new LoginUserAction(res));
          this.store.dispatch(new GetProUserAction(res));
          resolve(res);
        }, (e: any) => reject(e));
    });
  }

  public iframeAuth(url) {
    return new Promise((resolve, reject) => {
      const elementId: any = Math.random().toString(36).substring(7);
      const newIframe: any = document.createElement('iframe');
      newIframe.setAttribute('id', elementId);
      newIframe.setAttribute('src', url);
      newIframe.setAttribute('style', 'display:none;');
      newIframe.onload = () => {
        const element = document.getElementById(elementId);
        element.parentNode.removeChild(element);
        resolve();
      };
      newIframe.onerror = () => {
        reject();
      };
      document.body.appendChild(newIframe);
    });
  }
}
