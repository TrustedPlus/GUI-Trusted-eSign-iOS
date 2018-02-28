import { FOOTER_ACTION, FOOTER_CLOSE, CERT_ACTION, CREATE_FILES, CREATE_FILES_SUCCESS, CREATE_FILES_ERROR} from "../constants";
import * as RNFS from "react-native-fs";

export function footerAction(idButton) {
  return {
    type: FOOTER_ACTION,
    payload: idButton
  };
}

export function footerClose() {
  return {
    type: FOOTER_CLOSE
  };
}

export function certAdd(title, img, note) {
  return {
    type: CERT_ACTION,
    payload: [title, img, note]
  };
}

export function createFiles() {
  return function action(dispatch) {
    dispatch({type: CREATE_FILES});
    const request = RNFS.readDir(RNFS.DocumentDirectoryPath + "/Files");

    return request.then(
      response => dispatch(createFilesSuccess(response)),
      err => dispatch(createFilesError(err))
    );
  };
}

export function createFilesSuccess(file) {
  let filearr = [], point, name, extension, mtime;
  let length = file.length;
  for (let i = 0; i < length; i++) {
    point = file[i].name.indexOf(".");
    name = file[i].name.substring(0, point);
    extension = file[i].name.substring(point + 1);
    mtime = file[i].mtime + "";
    filearr[i] = {name, extension, mtime};
  }
  return {
    type: CREATE_FILES_SUCCESS,
    payload: filearr
  };
}

export function createFilesError(error) {
  return {
    type: CREATE_FILES_ERROR,
    payload: error
  };
}