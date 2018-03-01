import { READ_FILES, READ_FILES_SUCCESS, READ_FILES_ERROR } from "../constants";

const initialState = {
  files: []
};

export function Files(state = initialState, action) {
  switch (action.type) {
    case READ_FILES:
      return {
        ...state
      };
    case READ_FILES_SUCCESS:
      return {
          ...state,
          files: action.payload
        };
    case READ_FILES_ERROR:
      return {
        ...state
      };
    default:
      return state;
  }
}