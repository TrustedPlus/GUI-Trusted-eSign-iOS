import { SIGN_FILES, ENCRYPT_FILES, CREATE_FILES, CREATE_FILES_SUCCESS, CREATE_FILES_ERROR } from "../constants";
import * as RNFS from "react-native-fs";

const initialState = {
  id: [0/*, 1, 2, 3*/],
  title: [/*, "Договор №2332 с приложениями", "Заключение от поставке"*/],
  extension: [/*"pdf",*/"txt"/*, "zip", "docx"*/],
  note: [/*12 января 2018, 02:34:22",*/"12 января 2018, 02:36:38"/*, "6 января 2018, 13:49:26", "6 января 2018, 14:28:18"*/]
};

function changeExtensionSign(OldExtension, id) {
  let length = id.length;
  while (length) {
    OldExtension[id[length]] = "sig";
    length--;
  }
  OldExtension[id[0]] = "sig";
  return OldExtension;
}

function changeExtensionEncrypt(OldExtension, id) {
  let length = id.length;
  while (length) {
    OldExtension[id[length]] = "enc";
    length--;
  }
  OldExtension[id[0]] = "enc";
  return OldExtension;
}

export function Files(state = initialState, action) {
  switch (action.type) {
    case SIGN_FILES:
      return {
        ...state,
        extension: changeExtensionSign(state.extension, action.payload)
      };
    case ENCRYPT_FILES:
      return {
        ...state,
        extension: changeExtensionEncrypt(state.extension, action.payload)
      };
    case CREATE_FILES:
      return {
        ...state,
        title: action.payload
      };
    case CREATE_FILES_SUCCESS:
    return {
        ...state,
        title: action.payload
      };
    case CREATE_FILES_ERROR:
      return {
        ...state
      };
    default:
      return state;
  }
}