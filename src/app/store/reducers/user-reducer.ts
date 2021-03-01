import {Actions, GET_USER} from '../actions/user-action';

export function userReducer(state: any = null, action: Actions) {
  switch (action.type) {
    case GET_USER:
      return {...state, user: action.payload};

    default:
      return state;
  }
}
