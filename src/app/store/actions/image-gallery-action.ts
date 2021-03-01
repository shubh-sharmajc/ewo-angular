import {Action} from '@ngrx/store';

export const GET_IMG_GALLERY_LIST = 'GET_IMG_GALLERY_LIST';
export const GET_IMG = 'GET_IMG';
export const GET_COMMENTS = 'GET_COMMENTS';
export const ADD_COMMENT = 'ADD_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const EDIT_COMMENT = 'EDIT_COMMENT';

export class GetImageGalleryListAction implements Action {
  readonly type = GET_IMG_GALLERY_LIST;

  constructor(public payload: any) {
  }
}

export class GetImageAction implements Action {
  readonly type = GET_IMG;

  constructor(public payload: any) {
  }
}

export class GetComments implements Action {
  readonly type = GET_COMMENTS;

  constructor(public payload: any) {
  }
}

export class AddComment implements Action {
  readonly type = ADD_COMMENT;

  constructor(public payload: any) {
  }
}

export class DeleteComment implements Action {
  readonly type = DELETE_COMMENT;

  constructor(public payload: any) {
  }
}

export class EditComment implements Action {
  readonly type = EDIT_COMMENT;

  constructor(public payload: any) {
  }
}

export type Actions = GetImageGalleryListAction | GetImageAction | GetComments | AddComment | DeleteComment | EditComment;
