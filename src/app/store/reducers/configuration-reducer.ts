import {Actions, GET_EXPLORE_FEATURES, GET_PRO_ALL_DATA_ACTION, HOME_CONTENT} from '../actions/configuration-actioin';

export function configReducer(state: any, action: Actions) {
  switch (action.type) {
    case GET_EXPLORE_FEATURES:
      return {...state, exploreFeature: action.payload};
    case HOME_CONTENT:
      return {...state, homeContent: action.payload};
    case GET_PRO_ALL_DATA_ACTION:
      return {...state, getProAllData: action.payload};

    default:
      return state;
  }
}
