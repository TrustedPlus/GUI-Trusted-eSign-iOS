import { FOOTER_ACTION, FOOTER_CLOSE, CERT_ACTION, READ_FILES, READ_FILES_SUCCESS, READ_FILES_ERROR} from "../constants";
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

export function readFiles() {
  return function action(dispatch) {
    dispatch({type: READ_FILES});
    const request = RNFS.readDir(RNFS.DocumentDirectoryPath + "/Files");

    return request.then(
      response => dispatch(readFilesSuccess(response)),
      err => dispatch(readFilesError(err))
    );
  };
}

export function readFilesSuccess(file) {
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
    type: READ_FILES_SUCCESS,
    payload: filearr
  };
}

export function readFilesError(error) {
  return {
    type: READ_FILES_ERROR,
    payload: error
  };
}