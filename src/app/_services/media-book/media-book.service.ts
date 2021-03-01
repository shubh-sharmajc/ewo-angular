import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import * as _ from 'lodash';

import {environment} from '../../../environments/environment';
import {AppState} from '../../app.state';
import {
  CreateMediaBookAction,
  CreateSearchMediaBookAction,
  DeleteMediaBookAction,
  DeleteSearchMediaBookAction,
  GetMediaBookAction,
  GetMediaBookListAction,
  SearchMediaBookAction
} from '../../store/actions/media-book-action';

@Injectable()
export class MediaBookService {

  constructor(private store: Store<AppState>,
              private http: HttpClient,
              private router: Router) {
  }

  searchMediaBookList(text: string, pageNo?: any, resetState: any = false, mbIds?: any) {
    let url = `${environment.apiUrl}/mediabook/search/${text}`;
    if (pageNo) {
      url = `${environment.apiUrl}/mediabook/search/${text}/${pageNo}`;
    }
    if (mbIds) {
      url += `?mbs=${mbIds}`;
    }
    return new Promise((resolve, reject) => {
      this.http.get<any>(url)
        .subscribe((res: any) => {
          const arr: any[] = [];
          if (res && res.data) {
            res.data.forEach((d: any) => {
              for (const key in d) {
                if (d.hasOwnProperty(key)) {
                  d[key].forEach((o: any) => {
                    o.dataType = key;
                    if (key === 'MediabookItems') {
                      if (o.subject && o.desc) {
                        o.header = `(${o.subject}) ${o.desc}`;
                      } else if (o.subject) {
                        o.header = `(${o.subject})`;
                      } else if (o.desc) {
                        o.header = `${o.desc}`;
                      } else {
                        o.header = '';
                      }
                    } else if (key === 'Mediabooks') {
                      o.image_url = o.image_url ? encodeURI(o.image_url) : null;
                    }
                    arr.push(o);
                  });
                }
              }
            });
          }
          this.store.dispatch(new SearchMediaBookAction({data: arr, resetState}));
          return resolve(arr);
        }, (e) => reject(e));
    });
  }

  getMediaBookList(pageNo?: any, userID?: any, resetState: any = false) {
    let url = `${environment.apiUrl}/mediabook`;
    if (userID && pageNo) {
      url = `${environment.apiUrl}/mediabook/${userID}/${pageNo}?other=1`;
    } else if (pageNo) {
      url = `${environment.apiUrl}/mediabook/0/${pageNo}`;
    }
    return new Promise((resolve, reject) => {
      this.http.get<any>(url)
        .subscribe((res: any) => {
          if (res && res.data) {
            res.data = res.data.map((o: any) => {
              o.image_url = o.image_url ? encodeURI(o.image_url) : null;
              return o;
            });
          }
          this.store.dispatch(new GetMediaBookListAction({data: res.data, resetState}));
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  getMediaBook(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${environment.apiUrl}/mediabook/${id}`)
        .subscribe((res: any) => {
          if (res && res.data && res.data.length) {
            res.data = res.data[0];
          }
          this.store.dispatch(new GetMediaBookAction(res));
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  createMediaBook(mediaBookObj: any) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/mediabook`, mediaBookObj)
        .subscribe((res: any) => {
          if (this.router.url.includes('/mediabooks/search')) {
            res.data.dataType = 'Mediabooks';
            res.data.image_url = res.data.image_url ? encodeURI(res.data.image_url) : null;
            this.store.dispatch(new CreateSearchMediaBookAction(res.data));
          } else {
            this.store.dispatch(new CreateMediaBookAction(res.data));
          }
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  updateMediaBook(id: string, mediaBookObj: any) {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}/mediabook/${id}`, mediaBookObj)
        .subscribe((res: any) => {
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  deleteMediaBook(ids: any) {
    return new Promise((resolve, reject) => {
      this.http.delete<any>(`${environment.apiUrl}/mediabook/${ids}`)
        .subscribe((res: any) => {
          const idsArr: any[] = ids.split(',');
          _.forEach(idsArr, (id) => {
            if (this.router.url.includes('/mediabooks/search')) {
              this.store.dispatch(new DeleteSearchMediaBookAction(id));
            } else {
              this.store.dispatch(new DeleteMediaBookAction(id));
            }
          });
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  accessMediaBook(id: string, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}/mediabook/${id}/access`, payload)
        .subscribe((res: any) => {
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  shareMediaBook(id: string, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}/mediabook/${id}/share`, payload)
        .subscribe((res: any) => {
          return resolve(res);
        }, (e) => reject(e));
    });
  }

  setMediaBookCover(id: string, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}/mediabook/${id}/cover`, payload)
        .subscribe((res: any) => {
          return resolve(res);
        }, (e) => reject(e));
    });
  }
}
