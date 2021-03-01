import {Action} from '@ngrx/store';

export const GET_PRO_USER = 'GET_PRO_USER';
export const GET_BUSINESS_TYPES = 'GET_BUSINESS_TYPES';
export const GET_PROS = 'GET_PROS';

export class GetProUserAction implements Action {
  readonly type = GET_PRO_USER;

  constructor(public payload: any) {
  }
}

export class GetBusinessTypesAction implements Action {
  readonly type = GET_BUSINESS_TYPES;

  constructor(public payload: any) {
  }
}

export class GetProsAction implements Action {
  readonly type = GET_PROS;

  constructor(public payload: any) {
  }
}

export type Actions =
  GetProUserAction
  | GetBusinessTypesAction
  | GetProsAction;
