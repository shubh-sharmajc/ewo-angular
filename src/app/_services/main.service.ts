import {EventEmitter, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from './../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {NodeBBLoginUserSlugAction, NodeBBUserSlugAction} from '../store/actions/nodebb-action';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  userData: any;
  isMobileMenuOpen = new EventEmitter();

  constructor(private http: HttpClient,
              private store: Store<AppState>) {
  }

  getNotificationCount(email) {
    return this.http.post<any>(`${environment.DISSCUSSION_LINK}get_notif_counts`, {email: email}, {}).pipe(
      map((resp) => {
        return resp;
      }),
      catchError(this.handleErrorPost<any>(''))
    );
  }

  getMessageCount(email) {
    return this.http.post<any>(`${environment.DISSCUSSION_LINK}get_msg_counts`, {email: email}, {}).pipe(
      map((resp) => {
        return resp;
      }),
      catchError(this.handleErrorPost<any>(''))
    );
  }

  getNodeBBSlug(email: string, isLoginUser?: any) {
    return new Promise((resolve) => {
      this.http.post<any>(`${environment.DISSCUSSION_LINK}get_userslug`, {email: email})
        .subscribe((res: any) => {
          if (isLoginUser) {
            this.store.dispatch(new NodeBBLoginUserSlugAction(res));
          } else {
            this.store.dispatch(new NodeBBUserSlugAction(res));
          }
          return resolve(res);
        });
    });
  }

  loadMoreImages(data): Observable<any> {
    const URL = `${environment.apiUrl}` + '/image/imageList/' +
      data.imageCounter + '/' + data.promotionCounter + '/' +
      data.bannerCounter + '/' + data.user_id + '/' + data.ramdon_no + '?search=' + data.searchStr;

    return this.http
      .get(URL)
      .pipe(
        map(res => res)
      );
  }

  clickImage(data) {
    const params = {'image_id': data.image_id, 'user_id': data.user_id, 'duration': data.count_sec, 'page': data.page};

    this.http.post<any>(`${environment.apiUrl}/image/api/image/click`, params).subscribe((resp) => {

    });
  }

  viewImage(data) {
    const params = {'image_id': data.image_id, 'user_id': data.user_id, 'type': data.type, 'page': data.page};

    this.http.post<any>(`${environment.apiUrl}/image/api/gallery/view`, params).subscribe((resp) => {
      },
      error => console.log('oops', error.status));
  }

  likeFlagImage(data) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/image/like-flag-experience`, data, {})
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  commentOnImage(data) {
    return this.http.post<any>(`${environment.apiUrl}/image/experience-comment`, data, {}).pipe(
      map((resp) => {
        return resp;
      }));
  }

  getSingleImageData(image_id) {
    return this.http.get<any>(`${environment.apiUrl}/image/single/` + image_id).pipe(
      map((resp) => {
        return resp;
      }));
  }

  getComments(image_id, skip) {
    return this.http.get<any>(`${environment.apiUrl}/image/comments/` + image_id + '/' + skip).pipe(
      map((resp) => {
        return resp;
      }));
  }

  imageDuration(data) {
    const params = {'image_id': data.image_id, 'user_id': data.user_id, 'duration': data.duration, 'page': data.page};

    this.http.post<any>(`${environment.apiUrl}/image/api/image/duration`, params).subscribe((resp) => {

    });
  }

  getGalleryData(data): Observable<any> {
    const URL = `${environment.apiUrl}` + '/gallery/galleryList/' + data.image_id;

    return this.http
      .get(URL)
      .pipe(
        map(res => res)
      );
  }

  saveSearchLog(data) {
    this.http.post<any>(`${environment.apiUrl}/image/api/search_log`, data).subscribe((resp) => {

    });
  }

  searchConversation(text) {
    const params = {
      params: new HttpParams()
        .set('term', text)
        .set('searchOnly', '1')
        .set('in', 'titles')
    };
    return this.http.get<any>(`${environment.DISSCUSSION_LINK}search`, params).pipe(
      map((resp) => {
        return resp;
      }));
  }

  searchTrendingRecord(): Observable<any> {
    const URL = `${environment.apiUrl}/wp-api/trending-search`;

    return this.http
      .get(URL)
      .pipe(
        map(res => res)
      );
  }

  getStoryCategory(): Observable<any> {
    const URL = `${environment.WP_LINK}wp-apis.php?type=storycategory`;

    return this.http
      .get(URL)
      .pipe(
        map(res => res)
      );
  }

  findUsers(data): Observable<any> {
    const URL = `${environment.apiUrl}` + '/user/search';

    return this.http.post(URL, data).pipe(
      map((resp) => {
        return resp;
      }),
      catchError(this.handleErrorPost<any>(''))
    );
  }

  findProUsers(data): Observable<any> {
    const URL = `${environment.apiUrl}` + '/user/find-providers';

    return this.http.post(URL, data).pipe(
      map((resp) => {
        return resp;
      }),
      catchError(this.handleErrorPost<any>(''))
    );
  }

  private handleErrorPost<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(result); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
