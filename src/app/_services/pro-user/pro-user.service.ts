import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as _ from 'lodash';
import * as op from 'object-path';

import {environment} from '../../../environments/environment';
import {AppState} from '../../app.state';
import {GetProsAction, GetProUserAction} from '../../store/actions/pro-actioin';

@Injectable()
export class ProUserService {

  constructor(private store: Store<AppState>,
              private http: HttpClient) {
  }

  getProUser(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/user/pro/${id}`)
        .subscribe((res: any) => {
          this.store.dispatch(new GetProUserAction(res.data));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  updateProUser(userID: string, locationID: string, payload) {
    let url: any = `${environment.apiUrl}/user/pro/${userID}`;
    if (locationID) {
      url += `/location/${locationID}`;
    }
    return new Promise((resolve, reject) => {
      this.http.put<any>(url, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  checkBusinessName(payload: any) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/user/check-business-name`, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  sendReviewsRequests(userID: string, payload) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/user/pro/${userID}/reviews-requests`, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  linkPreview(payload) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/api/link-preview`, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  findProviders(payload: any, resetState: any = false) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/user/find-providers`, payload)
        .subscribe((res: any) => {
          this.store.dispatch(new GetProsAction({data: op.get(res, 'data.0.data', []), resetState}));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  getLocations(qp: any) {
    let url = `${environment.apiUrl}/user/locations`;
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
      this.http.get(url).subscribe((res: any) => resolve(res && res.data), (e: any) => reject(e));
    });
  }

  searchProviders(payload?: any) {
    return new Observable((observer: any) => {
      this.http.post(`${environment.apiUrl}/user/find-providers`, payload)
        .subscribe((res: any) => {
          observer.next(op.get(res, 'data.0.data', []));
        }, (e) => {
          console.log(e.error.message);
          observer.next([]);
        });
    });
  }
}
