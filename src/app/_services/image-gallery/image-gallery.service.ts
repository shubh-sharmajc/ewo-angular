import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import * as _ from 'lodash';

import {AppState} from '../../app.state';
import {environment} from '../../../environments/environment';
import {
  AddComment,
  DeleteComment,
  EditComment,
  GetComments,
  GetImageAction,
  GetImageGalleryListAction
} from '../../store/actions/image-gallery-action';


@Injectable()
export class ImageGalleryService {

  constructor(private http: HttpClient,
              private store: Store<AppState>) {
  }

  getImageGalleryList(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${environment.apiUrl}/gallery/galleryList/${id}`)
        .subscribe((res: any) => {
          this.store.dispatch(new GetImageGalleryListAction(res));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  getImageListMediabook(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${environment.apiUrl}/mediabook/item/image/list/${id}`)
        .subscribe((res: any) => {
          this.store.dispatch(new GetImageGalleryListAction(res));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  getStoryImages(story_url: string) {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${environment.apiUrl}/image/story/${story_url}`)
        .subscribe((res: any) => {
          this.store.dispatch(new GetImageGalleryListAction(res));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  getSingleImage(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${environment.apiUrl}/image/single/${id}`)
        .subscribe((res: any) => {
          this.store.dispatch(new GetImageAction(res.data));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  getSimilarImages(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${environment.apiUrl}/image/${id}/similar`)
        .subscribe((res: any) => {
          if (res && res.imageData && res.imageData.length) {
            res.imageData = res.imageData.map((o: any) => {
              o.picture_url = encodeURI(o.picture_url);
              o.picture_thumb_url = encodeURI(o.picture_thumb_url);
              return o;
            });
          }
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  getComments(imgID: string, all: any = false, resetState: any = false) {
    let url = `${environment.apiUrl}/image/${imgID}/comment`;
    if (all) {
      url = `${environment.apiUrl}/image/${imgID}/comment/all`;
    }
    return new Promise((resolve, reject) => {
      this.http.get<any>(url)
        .subscribe((res: any) => {
          const comments: any = res && res.data && res.data.exp_comments ? res.data.exp_comments : [];
          this.store.dispatch(new GetComments({comments, resetState}));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  likeOrFlagImage(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/image/like-flag-experience`, data)
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  saveComment(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/image/experience-comment`, data)
        .subscribe((res: any) => {
          if (_.isObject(res) && _.isObject(res.data) && _.isArray(res.data.exp_comments)) {
            const commentObj = res.data.exp_comments.pop();
            commentObj.user_id = data.currentUser;
            this.store.dispatch(new AddComment(commentObj));
          }
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  deleteComment(imgID: any, commentID: any) {
    return new Promise((resolve, reject) => {
      this.http.delete<any>(`${environment.apiUrl}/image/${imgID}/comment/${commentID}`)
        .subscribe((res: any) => {
          this.store.dispatch(new DeleteComment(commentID));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  flagComment(imgID: any, commentID: any) {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}/image/${imgID}/comment/${commentID}/flag-unflag`, null)
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  likeComment(imgID: any, commentID: any) {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}/image/${imgID}/comment/${commentID}/like-unlike`, null)
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }

  updateComment(data: any) {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}/image/${data.imgID}/comment/${data.commentID}`, data.comment)
        .subscribe((res: any) => {
          this.store.dispatch(new EditComment(data));
          return resolve(res);
        }, (e: any) => reject(e));
    });
  }

  shareViaEmail(imageId: any, payload: any) {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}/image/${imageId}/share`, payload)
        .subscribe((res) => resolve(res), (e: any) => reject(e));
    });
  }
}
