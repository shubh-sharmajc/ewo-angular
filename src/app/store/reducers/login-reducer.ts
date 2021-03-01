import {Actions, GET_MY_REVIEWS, USER_LOGIN, USER_LOGOUT} from '../actions/login-action';

export function loginReducer(state: any, action: Actions) {
  let myReviews: any = [];
  switch (action.type) {
    case USER_LOGIN:
      return {...state, data: action.payload};

    case USER_LOGOUT:
      return {...state, data: action.payload};

    case GET_MY_REVIEWS:
      if (action.payload.resetState) {
        myReviews = [];
      } else {
        myReviews = state && state.myReviews ? state.myReviews : [];
      }
      return {...state, myReviews: [...myReviews, ...action.payload.data]};

    default:
      return state;
  }
}
