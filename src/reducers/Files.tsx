import { READ_FILES, READ_FILES_SUCCESS, READ_FILES_ERROR } from "../constants";

const initialState = {
  files: [],
  isFetching: false
};

export function Files(state = initialState, action) {
  switch (action.type) {
    case READ_FILES:
      return {
        ...state,
        isFetching: true
      };
    case READ_FILES_SUCCESS:
      return {
          ...state,
          files: action.payload,
          isFetching: false
        };
    case READ_FILES_ERROR:
      return {
        ...state
      };
    default:
      return state;
  }
}