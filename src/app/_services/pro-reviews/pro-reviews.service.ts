import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import * as _ from 'lodash';

import {environment} from '../../../environments/environment';
import {AppState} from '../../app.state';
import {GetProReviewAction, GetProReviewOverviewAction} from '../../store/actions/pro-review-actioin';

@Injectable()
export class ProReviewsService {

  constructor(private store: Store<AppState>,
              private http: HttpClient) {
  }

  addReviews(payload) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/user/reviews`, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  editReviews(reviewId, payload) {
    return new Promise((resolve, reject) => {
      this.http.put(`${environment.apiUrl}/user/reviews/${reviewId}`, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  addReviewComment(reviewId: string, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/user/reviews/${reviewId}/comment`, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  flagReview(reviewId: string, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.put(`${environment.apiUrl}/user/reviews/${reviewId}/flag`, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  flagComment(reviewId: string, commentId: string, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.put(`${environment.apiUrl}/user/reviews/${reviewId}/comment/${commentId}/flag`, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  listReviews(businessID: any, locationID: any, qp?, resetState: any = false) {
    let url = `${environment.apiUrl}/user/business/${businessID}/location/${locationID}/reviews`;
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
          this.store.dispatch(new GetProReviewAction({data: res.data, resetState}));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  reviewOverview(id: string, locId: any) {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/user/business/${id}/location/${locId}/reviews/overview`)
        .subscribe((res: any) => {
          this.store.dispatch(new GetProReviewOverviewAction(res.data));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }
}
