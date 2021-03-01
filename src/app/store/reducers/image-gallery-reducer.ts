import * as _ from 'lodash';
import {
  Actions,
  ADD_COMMENT,
  DELETE_COMMENT,
  EDIT_COMMENT,
  GET_COMMENTS,
  GET_IMG,
  GET_IMG_GALLERY_LIST
} from '../actions/image-gallery-action';

export function imageGalleryReducer(state: any = null, action: Actions) {
  let list: any = [];
  switch (action.type) {
    case GET_IMG_GALLERY_LIST:
      return {...state, imgGalleryList: action.payload};
    case GET_IMG:
      return {...state, image: action.payload};
    case GET_COMMENTS:
      if (action.payload.resetState) {
        list = [];
      } else {
        list = state && state.commentsList ? state.commentsList : [];
      }
      return {...state, commentsList: _.merge(list, action.payload.comments)};
    case ADD_COMMENT:
      list = state && state.commentsList ? state.commentsList : [];
      list.push(action.payload);
      return {...state, commentsList: list};
    case DELETE_COMMENT:
      list = state.commentsList;
      if (list && list.length > 0) {
        const index: any = list.findIndex((o) => o._id === action.payload);
        if (index > -1) {
          list.splice(index, 1);
        }
      }
      return {...state, commentsList: list};
    case EDIT_COMMENT:
      list = state.commentsList;
      if (list && list.length > 0) {
        const index: any = list.findIndex((o) => o._id === action.payload.commentID);
        if (index > -1) {
          list[index].comment = action.payload.comment.comment;
        }
      }
      return {...state, commentsList: list};
    default:
      return state;
  }
}
