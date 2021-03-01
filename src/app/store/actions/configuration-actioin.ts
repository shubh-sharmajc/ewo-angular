import {Action} from '@ngrx/store';

export const GET_EXPLORE_FEATURES = 'EXPLORE_FEATURES';
export const HOME_CONTENT = 'HOME_CONTENT';
export const GET_PRO_ALL_DATA_ACTION = 'GET_PRO_ALL_DATA_ACTION';

export class GetExploreFeaturesAction implements Action {
  readonly type = GET_EXPLORE_FEATURES;

  constructor(public payload: any) {
  }
}

export class GetHomeContentAction implements Action {
  readonly type = HOME_CONTENT;

  constructor(public payload: any) {
  }
}

export class GetProAllDataAction implements Action {
  readonly type = GET_PRO_ALL_DATA_ACTION;

  constructor(public payload: any) {
  }
}

export type Actions = GetExploreFeaturesAction | GetHomeContentAction | GetProAllDataAction;
