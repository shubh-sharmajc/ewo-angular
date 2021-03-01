import {
  ACCESS_MEDIA_BOOK,
  Actions,
  CREATE_MEDIA_BOOK,
  CREATE_MEDIA_BOOK_ITEM,
  CREATE_SEARCH_MEDIA_BOOK,
  DELETE_MEDIA_BOOK,
  DELETE_MEDIA_BOOK_ITEM,
  DELETE_SEARCH_MEDIA_BOOK,
  GET_MEDIA_BOOK,
  GET_MEDIA_BOOK_ITEM_LIST,
  GET_MEDIA_BOOK_LIST,
  GET_SHARD_MEDIA_BOOK,
  SEARCH_MEDIA_BOOK,
  UPDATE_MEDIA_BOOK,
  UPDATE_MEDIA_BOOK_ITEM
} from '../actions/media-book-action';

export function mediaBookReducer(state: any, action: Actions) {
  let list: any = [];
  switch (action.type) {
    case SEARCH_MEDIA_BOOK:
      if (action.payload.resetState) {
        list = [];
      } else {
        list = state && state.searchList ? state.searchList : [];
      }
      return {...state, searchList: [...list, ...action.payload.data]};
    case GET_MEDIA_BOOK_LIST:
      if (action.payload.resetState) {
        list = [];
      } else {
        list = state && state.list ? state.list : [];
      }
      return {...state, list: [...list, ...action.payload.data]};
    case GET_MEDIA_BOOK:
    case UPDATE_MEDIA_BOOK:
    case ACCESS_MEDIA_BOOK:
      return {...state, item: action.payload};
    case GET_SHARD_MEDIA_BOOK:
      let sharedMB: any = {};
      if (state && state.sharedMB) {
        sharedMB.mediabook = {...state.sharedMB.mediabook, ...action.payload.mediabook};
        if (action.payload.resetState) {
          sharedMB.data = [];
        } else {
          sharedMB.data = state.sharedMB.data ? state.sharedMB.data : [];
        }
        sharedMB.data = [...sharedMB.data, ...action.payload.data];
      } else {
        sharedMB = action.payload;
      }
      return {...state, sharedMB};
    case CREATE_MEDIA_BOOK:
      list = state.list;
      if (list && list.length > 0) {
        list.push(action.payload);
      }
      return {...state, list: list};
    case CREATE_SEARCH_MEDIA_BOOK:
      list = state.searchList;
      if (list && list.length > 0) {
        list.push(action.payload);
      }
      return {...state, searchList: list};
    case DELETE_MEDIA_BOOK:
      list = state.list;
      if (list && list.length > 0) {
        const index: any = list.findIndex((o) => o._id === action.payload);
        if (index > -1) {
          list.splice(index, 1);
        }
      }
      return {...state, list: list};
    case DELETE_SEARCH_MEDIA_BOOK:
      list = state.searchList;
      if (list && list.length > 0) {
        const index: any = list.findIndex((o) => o._id === action.payload);
        if (index > -1) {
          list.splice(index, 1);
        }
      }
      return {...state, searchList: list};
    case CREATE_MEDIA_BOOK_ITEM:
      return {...state, createMediaBookItem: action.payload};
    case UPDATE_MEDIA_BOOK_ITEM:
      return {...state, updateMediaBookItem: action.payload};
    case GET_MEDIA_BOOK_ITEM_LIST:
      if (action.payload.resetState) {
        list = [];
      } else {
        list = state && state.mediaBookItemList ? state.mediaBookItemList : [];
      }
      return {...state, mediaBookItemList: [...list, ...action.payload.data]};
    case DELETE_MEDIA_BOOK_ITEM:
      list = state.mediaBookItemList;
      const payloadArr = action.payload.split(',');
      if (list && list.length > 0) {
        for (let i = payloadArr.length - 1; i >= 0; i--) {
          const index: any = list.findIndex((o) => o._id === payloadArr[i]);
          if (index > -1) {
            list.splice(index, 1);
          }
        }
      }
      return {...state, mediaBookItemList: list};

    default:
      return state;
  }
}
