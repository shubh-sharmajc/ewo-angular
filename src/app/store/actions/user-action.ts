import {Action} from '@ngrx/store';

export const GET_USER = 'GET_USER';

export class UserAction implements Action {
  readonly type = GET_USER;

  constructor(public payload: any) {
  }
}

export type Actions = UserAction;
