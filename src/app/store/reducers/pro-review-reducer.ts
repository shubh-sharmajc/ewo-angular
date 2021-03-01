import {Actions, GET_REVIEWS, GET_REVIEWS_OVERVIEW} from '../actions/pro-review-actioin';

export function proReviewReducer(state: any, action: Actions) {
  let reviews: any = [];
  switch (action.type) {
    case GET_REVIEWS:
      if (action.payload.resetState) {
        reviews = [];
      } else {
        reviews = state && state.reviews ? state.reviews : [];
      }
      return {...state, reviews: [...reviews, ...action.payload.data]};
    case GET_REVIEWS_OVERVIEW:
      return {...state, overview: action.payload};

    default:
      return state;
  }
}
