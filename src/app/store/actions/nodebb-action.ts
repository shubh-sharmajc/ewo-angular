import {Action} from '@ngrx/store';

export const GET_USER_SLUG = 'GET_USER_SLUG';
export const GET_LOGIN_USER_SLUG = 'GET_LOGIN_USER_SLUG';

export class NodeBBLoginUserSlugAction implements Action {
  readonly type = GET_LOGIN_USER_SLUG;

  constructor(public payload: any) {
  }
}

export class NodeBBUserSlugAction implements Action {
  readonly type = GET_USER_SLUG;

  constructor(public payload: any) {
  }
}

export type Actions = NodeBBLoginUserSlugAction | NodeBBUserSlugAction;
