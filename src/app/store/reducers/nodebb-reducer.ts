import {Actions, GET_LOGIN_USER_SLUG, GET_USER_SLUG} from '../actions/nodebb-action';

export function nodeBBReducer(state: any, action: Actions) {
  switch (action.type) {
    case GET_LOGIN_USER_SLUG:
      return {...state, loginUserSlug: action.payload};

    case GET_USER_SLUG:
      return {...state, userSlug: action.payload};

    default:
      return state;
  }
}
