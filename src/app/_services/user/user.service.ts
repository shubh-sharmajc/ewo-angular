import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {Observable, Subscriber} from 'rxjs';
import {map} from 'rxjs/operators';
import * as _ from 'lodash';

import {environment} from '../../../environments/environment';
import {AppState} from '../../app.state';
import {UserAction} from '../../store/actions/user-action';
import {AuthAPIService} from '../auth-api/auth-api.service';
import {GetProUserAction} from '../../store/actions/pro-actioin';
import {GetMyReviewAction} from '../../store/actions/login-action';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private store: Store<AppState>,
              private http: HttpClient,
              private authAPI: AuthAPIService) {
  }

  public updateUserProfile(id: string, data: any) {
    const formData: any = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/user/edit-profile/${id}`, formData)
        .subscribe(async (res: any) => {
          try {
            const user: any = await this.authAPI.getLoginUserInfo();
            this.store.dispatch(new UserAction({data: user}));
          } catch (e) {
            console.log('UserService -> updateUserProfile ::: ', e);
          }
          resolve(res);
        }, (e: any) => reject(e));
    });
  }

  public updatePassword(payload: any) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/user/update-password`, payload)
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  public getFollowerFollowingCount(userSlug: string) {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${environment.apiUrl}/user/follower-following-count/${userSlug}`)
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  public followUnfollow(body: any) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/user/follow-unfollow`, body)
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  public searchUser(payload: any) {
    const URL = `${environment.apiUrl}` + '/user/search';
    const EMAIL_REGEXP: any = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;
    if (EMAIL_REGEXP.test(payload.searchString)) {
      return Observable.create((observer: Subscriber<any>) => {
        observer.next([{
          name: payload.searchString,
          email: payload.searchString,
          picture_url: 'assets/img/user.svg',
          isExternalUser: true
        }]);
        observer.complete();
      });
    } else {
      return this.http.post(URL, payload).pipe(
        map((resp: any) => {
          return resp.data.docs;
        }));
    }
  }

  public checkUserEmailExist(email: string) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/user/check-email`, {email})
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  public incompleteRegistration(email: string) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/user/reset-registration`, {email})
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  public forgotPassword(email: string) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/user/forgot`, {email})
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  public resetPassword(token: string, body) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/user/reset/${token}`, body)
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  public getUserByUserName(username: string) {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${environment.apiUrl}/user/detail/${username}`)
        .subscribe((res: any) => {
          this.store.dispatch(new UserAction(res));
          this.store.dispatch(new GetProUserAction(res.data));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  public getMyReviews(userID: any, qp?, resetState: any = false) {
    let url = `${environment.apiUrl}/user/my-reviews`;
    const urlParams = _.pickBy(qp, _.identity);
    const params: any = new URLSearchParams();
    for (const key in urlParams) {
      if (urlParams.hasOwnProperty(key)) {
        urlParams[key] = encodeURIComponent(urlParams[key]);
        params.set(key, urlParams[key]);
      }
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    return new Promise((resolve, reject) => {
      this.http.get(url)
        .subscribe((res: any) => {
          this.store.dispatch(new GetMyReviewAction({data: res.data, resetState}));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }
}
