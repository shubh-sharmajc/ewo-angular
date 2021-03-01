import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {AppState} from '../../app.state';
import {environment} from '../../../environments/environment';
import {GetBusinessTypesAction} from '../../store/actions/pro-actioin';

@Injectable()
export class BusinessService {

  constructor(private store: Store<AppState>,
              private http: HttpClient) {
  }

  searchBusinessName(searchStr?: string) {
    return new Observable((observer: any) => {
      this.http.get<any>(`${environment.apiUrl}/user/business/name/${searchStr}`)
        .subscribe((res: any) => {
          observer.next(res && res.data || []);
        }, (e) => {
          console.log(e.error.message);
          observer.next([]);
        });
    });
  }

  searchBusinessCategory(searchStr?: string) {
    return new Observable((observer: any) => {
      this.http.get<any>(`${environment.apiUrl}/user/business/category/${searchStr}`)
        .subscribe((res: any) => {
          observer.next(res && res.data || []);
        }, (e) => {
          console.log(e.error.message);
          observer.next([]);
        });
    });
  }

  getBusinessTypes() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/user/business/types`)
        .subscribe((res: any) => {
          this.store.dispatch(new GetBusinessTypesAction(res.data));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  addTestimonials(businessID: any, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/user/business/${businessID}/testimonial`, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  updateTestimonials(businessID: any, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/user/business/${businessID}/testimonial/${payload._id}`, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  addRecognitions(businessID: any, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/user/business/${businessID}/recognition`, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  updateRecognitions(businessID: any, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/user/business/${businessID}/recognition/${payload._id}`, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  addNewBusinessLocation(businessID: any, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/user/business/${businessID}/location`, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }

  updateProUserPlan(businessID: string, payload: any) {
    const url: any = `${environment.apiUrl}/user/business/${businessID}/plan`;
    return new Promise((resolve, reject) => {
      this.http.put<any>(url, payload)
        .subscribe((res: any) => resolve(res), (e: any) => reject(e));
    });
  }
}
