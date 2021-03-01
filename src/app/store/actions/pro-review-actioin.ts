import {Action} from '@ngrx/store';

export const GET_REVIEWS = 'GET_REVIEWS';
export const GET_REVIEWS_OVERVIEW = 'GET_REVIEWS_OVERVIEW';

export class GetProReviewAction implements Action {
  readonly type = GET_REVIEWS;

  constructor(public payload: any) {
  }
}

export class GetProReviewOverviewAction implements Action {
  readonly type = GET_REVIEWS_OVERVIEW;

  constructor(public payload: any) {
  }
}

export type Actions = GetProReviewAction | GetProReviewOverviewAction;
