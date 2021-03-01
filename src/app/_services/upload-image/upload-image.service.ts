import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs';

import {environment} from '../../../environments/environment';
import {AppState} from '../../app.state';
import {LoginUserAction} from '../../store/actions/login-action';
import {UserService} from '../user/user.service';

@Injectable()
export class UploadImageService {

  public progress: BehaviorSubject<any> = new BehaviorSubject(0);

  constructor(private store: Store<AppState>,
              private http: HttpClient,
              private userService: UserService) {
  }

  uploadUserProfileImage(id: string, data: any) {
    return new Promise((resolve, reject) => {
      return this.http.post<any>(
        `${environment.apiUrl}/user/upload-profile-image/${id}`,
        data,
        {
          reportProgress: true,
          observe: 'events'
        })
        .subscribe((res: any) => {
          if (res.type === HttpEventType.UploadProgress) {
            this.progress.next(Math.round(100 * res.loaded / res.total));
          }
          if (res.type === HttpEventType.Response) {
            setTimeout(async () => {
              try {
                const resData: any = res.body.data;
                this.store.dispatch(new LoginUserAction(resData));
                await this.userService.getUserByUserName(resData.username);
                this.progress.next(0);
                resolve(resData);
              } catch (e) {
                console.log('UploadImageService -> uploadUserProfileImage ::: ', e);
                reject(e);
              }
            }, 1000);
          }
        }, (e: any) => reject(e));
    });

  }


  validateMediabookImageUpload(data: any) {
    return new Promise((resolve, reject) => {
      return this.http.post<any>(`${environment.apiUrl}/image/validate-image`, data)
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  uploadMediaBookImage(mediaBookObj) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(
        `${environment.apiUrl}/image/upload`,
        mediaBookObj,
        {
          reportProgress: true,
          observe: 'events'
        }
      ).subscribe((res) => {
        if (res.type === HttpEventType.UploadProgress) {
          this.progress.next(Math.round(100 * res.loaded / res.total));
        }
        if (res.type === HttpEventType.Response) {
          resolve(res.body);
        }
      }, (e: any) => reject(e));
    });
  }
}
