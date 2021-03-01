import {Action} from '@ngrx/store';

export const GET_MEDIA_BOOK = 'GET_MEDIA_BOOK';
export const GET_MEDIA_BOOK_LIST = 'GET_MEDIA_BOOK_LIST';
export const SEARCH_MEDIA_BOOK = 'SEARCH_MEDIA_BOOK';
export const CREATE_MEDIA_BOOK = 'CREATE_MEDIA_BOOK';
export const CREATE_SEARCH_MEDIA_BOOK = 'CREATE_SEARCH_MEDIA_BOOK';
export const UPDATE_MEDIA_BOOK = 'UPDATE_MEDIA_BOOK';
export const DELETE_MEDIA_BOOK = 'DELETE_MEDIA_BOOK';
export const DELETE_SEARCH_MEDIA_BOOK = 'DELETE_SEARCH_MEDIA_BOOK';
export const COPY_MEDIA_BOOK = 'COPY_MEDIA_BOOK';
export const ACCESS_MEDIA_BOOK = 'ACCESS_MEDIA_BOOK';

export const CREATE_MEDIA_BOOK_ITEM = 'CREATE_MEDIA_BOOK_ITEM';
export const UPDATE_MEDIA_BOOK_ITEM = 'UPDATE_MEDIA_BOOK_ITEM';
export const GET_MEDIA_BOOK_ITEM_LIST = 'GET_MEDIA_BOOK_ITEM_LIST';
export const DELETE_MEDIA_BOOK_ITEM = 'DELETE_MEDIA_BOOK_ITEM';
export const GET_SHARD_MEDIA_BOOK = 'GET_SHARD_MEDIA_BOOK';

export class SearchMediaBookAction implements Action {
  readonly type = SEARCH_MEDIA_BOOK;

  constructor(public payload: any) {
  }
}

export class GetMediaBookListAction implements Action {
  readonly type = GET_MEDIA_BOOK_LIST;

  constructor(public payload: any) {
  }
}

export class GetMediaBookAction implements Action {
  readonly type = GET_MEDIA_BOOK;

  constructor(public payload: any) {
  }
}

export class GetSharedMediaBookAction implements Action {
  readonly type = GET_SHARD_MEDIA_BOOK;

  constructor(public payload: any) {
  }
}

export class CreateMediaBookAction implements Action {
  readonly type = CREATE_MEDIA_BOOK;

  constructor(public payload: any) {
  }
}

export class CreateSearchMediaBookAction implements Action {
  readonly type = CREATE_SEARCH_MEDIA_BOOK;

  constructor(public payload: any) {
  }
}

export class CopyMediaBookAction implements Action {
  readonly type = COPY_MEDIA_BOOK;

  constructor(public payload: any) {
  }
}

export class UpdateMediaBookAction implements Action {
  readonly type = UPDATE_MEDIA_BOOK;

  constructor(public payload: any) {
  }
}

export class DeleteMediaBookAction implements Action {
  readonly type = DELETE_MEDIA_BOOK;

  constructor(public payload: any) {
  }
}

export class DeleteSearchMediaBookAction implements Action {
  readonly type = DELETE_SEARCH_MEDIA_BOOK;

  constructor(public payload: any) {
  }
}

export class AccessMediaBookAction implements Action {
  readonly type = ACCESS_MEDIA_BOOK;

  constructor(public payload: any) {
  }
}

export class GetMediaBookItemListAction implements Action {
  readonly type = GET_MEDIA_BOOK_ITEM_LIST;

  constructor(public payload: any) {
  }
}

export class CreateMediaBookItemAction implements Action {
  readonly type = CREATE_MEDIA_BOOK_ITEM;

  constructor(public payload: any) {
  }
}

export class UpdateMediaBookItemAction implements Action {
  readonly type = UPDATE_MEDIA_BOOK_ITEM;

  constructor(public payload: any) {
  }
}

export class DeleteMediaBookItemAction implements Action {
  readonly type = DELETE_MEDIA_BOOK_ITEM;

  constructor(public payload: any) {
  }
}

export type Actions =
  GetMediaBookListAction
  | SearchMediaBookAction
  | GetMediaBookAction
  | GetSharedMediaBookAction
  | CreateMediaBookAction
  | CreateSearchMediaBookAction
  | UpdateMediaBookAction
  | DeleteMediaBookAction
  | DeleteSearchMediaBookAction
  | AccessMediaBookAction
  | CreateMediaBookItemAction
  | UpdateMediaBookItemAction
  | GetMediaBookItemListAction
  | DeleteMediaBookItemAction;
