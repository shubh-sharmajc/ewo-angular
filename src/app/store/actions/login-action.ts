import {Action} from '@ngrx/store';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const GET_MY_REVIEWS = 'GET_MY_REVIEWS';

export class LoginUserAction implements Action {
  readonly type = USER_LOGIN;

  constructor(public payload: any) {
  }
}

export class LogoutUserAction implements Action {
  readonly type = USER_LOGOUT;

  constructor(public payload: any) {
  }
}

export class GetMyReviewAction implements Action {
  readonly type = GET_MY_REVIEWS;

  constructor(public payload: any) {
  }
}

export type Actions = LoginUserAction | LogoutUserAction | GetMyReviewAction;
