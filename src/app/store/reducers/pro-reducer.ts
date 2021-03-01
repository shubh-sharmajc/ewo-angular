import {Actions, GET_BUSINESS_TYPES, GET_PRO_USER, GET_PROS} from '../actions/pro-actioin';

export function proReducer(state: any, action: Actions) {
  let pros: any = [];
  switch (action.type) {
    case GET_PRO_USER:
      return {...state, proUser: action.payload};
    case GET_BUSINESS_TYPES:
      return {...state, bussTypes: action.payload};
    case GET_PROS:
      if (action.payload.resetState) {
        pros = [];
      } else {
        pros = state && state.pros ? state.pros : [];
      }
      return {...state, pros: [...pros, ...action.payload.data]};

    default:
      return state;
  }
}
