import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Store} from '@ngrx/store';
import * as op from 'object-path';
import * as _ from 'lodash';

import {
  CopyMediaBookAction,
  DeleteMediaBookItemAction,
  GetMediaBookItemListAction,
  GetSharedMediaBookAction, UpdateMediaBookItemAction
} from '../../store/actions/media-book-action';
import {environment} from '../../../environments/environment';
import {AppState} from '../../app.state';

@Injectable()
export class MediaBookItemsService {

  constructor(private store: Store<AppState>,
              private http: HttpClient) {
  }

  getMediaBookItemList(mbID: string, qp?: any, pageNo?: any, resetState: any = false) {
    let url = `${environment.apiUrl}/mediabook/${mbID}/item`;
    if (pageNo) {
      url = `${environment.apiUrl}/mediabook/${mbID}/item/0/${pageNo}`;
    }
    const urlParams = _.pickBy(qp, _.identity);
    const params: any = new URLSearchParams();
    for (const key in urlParams) {
      if (urlParams.hasOwnProperty(key)) {
        params.set(key, urlParams[key]);
      }
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    return new Promise((resolve, reject) => {
      this.http.get<any>(url)
        .subscribe((res: any) => {
          this.store.dispatch(new GetMediaBookItemListAction({data: op.get(res, 'data', []), resetState}));
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  getSharedMediaBookItemList(mbID: string, access_token: any, pageNo: any, type?: string, resetState: any = false) {
    let qp = '';
    if (type) {
      qp = `?type=${type}`;
    }
    const headers: HttpHeaders = new HttpHeaders({access_token});
    let url = `${environment.apiUrl}/mediabook/${mbID}/item/shared${qp}`;
    if (pageNo) {
      url = `${environment.apiUrl}/mediabook/${mbID}/item/shared/${pageNo}${qp}`;
    }
    return new Promise((resolve, reject) => {
      this.http.get<any>(url, {headers: headers})
        .subscribe((res: any) => {
          res.resetState = resetState;
          this.store.dispatch(new GetSharedMediaBookAction(res));
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  createMediaBookItem(mbID: string, mbItemObj: any) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/mediabook/${mbID}/item`, mbItemObj)
        .subscribe((res: any) => {
          return resolve(res);
        }, (e) => {
          return reject(e);
        });
    });
  }

  updateMediaBookItem(mbID: string, itemID: string, mbItemObj: any) {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}/mediabook/${mbID}/item/${itemID}`, mbItemObj)
        .subscribe((res: any) => {
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  deleteMediaBookItem(mbID: string, itemIDs: string) {
    return new Promise((resolve, reject) => {
      this.http.delete<any>(`${environment.apiUrl}/mediabook/${mbID}/item/${itemIDs}`)
        .subscribe((res: any) => {
          this.store.dispatch(new DeleteMediaBookItemAction(itemIDs));
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  copyToMediaBook(id: string, mediaBookObj: any) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/mediabook/${id}/item/copy`, mediaBookObj)
        .subscribe((res: any) => {
          this.store.dispatch(new CopyMediaBookAction(res.data));
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  shareMediaBookItem(mbID: string, itemID: string, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}/mediabook/${mbID}/item/${itemID}/share`, payload)
        .subscribe((res: any) => {
          this.store.dispatch(new UpdateMediaBookItemAction(res));
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  updateSequence(mbID: string, payload: any[]) {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}/mediabook/${mbID}/seq`, payload)
        .subscribe((res: any) => resolve(res), (e) => reject(e));
    });
  }

  linkToMediaBook(id: string, itemID: string, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}/mediabook/${id}/item/${itemID}/link`, payload)
        .subscribe((res: any) => resolve(res), (e) => reject(e));
    });
  }
}
