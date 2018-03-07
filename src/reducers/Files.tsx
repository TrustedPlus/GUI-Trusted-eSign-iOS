import { READ_FILES, READ_FILES_SUCCESS, READ_FILES_ERROR, SIGN_FILE, SIGN_FILE_ERROR, SIGN_FILE_SUCCESS, VERIFY_SIGN,
  VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR} from "../constants";

const initialState = {
  files: [],
  isFetching: false
};

function verySignSuccess(oldFiles, action) {
  for (let i = 0; i < oldFiles.length; i++) {
    if (oldFiles[i].name === action.payload) {
      oldFiles[i].verify = 1;
      return oldFiles;
    }
  }
}

function verySignError(oldFiles, action) {
  for (let i = 0; i < oldFiles.length; i++) {
    if (oldFiles[i].name === action.payload) {
      oldFiles[i].verify = -1;
      return oldFiles;
    }
  }
}

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
    case SIGN_FILE:
      return {
        ...state
      };
    case SIGN_FILE_ERROR:
      return {
        ...state
      };
    case SIGN_FILE_SUCCESS:
      return {
        ...state
      };
    case VERIFY_SIGN:
      return {
        ...state
      };
    case VERIFY_SIGN_SUCCESS:
      return {
        ...state,
        files: verySignSuccess(state.files, action)
      };
    case VERIFY_SIGN_ERROR:
      return {
        ...state,
        files: verySignError(state.files, action)
      };
    default:
      return state;
  }
}