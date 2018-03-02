import { FOOTER_ACTION, FOOTER_CLOSE, PERSONAL_CERT_ACTION, OTHER_CERT_ACTION,
  READ_FILES, READ_FILES_SUCCESS, READ_FILES_ERROR} from "../constants";
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

export function personalCertAdd(title, img, note) {
  return {
    type: PERSONAL_CERT_ACTION,
    payload: [title, img, note]
  };
}

export function otherCertAdd(title, img, note) {
  return {
    type: OTHER_CERT_ACTION,
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
  let k = 0;
  for (let i = 0; i < length; i++) {
    point = file[i].name.indexOf(".");
    name = file[i].name.substring(0, point);
    extension = file[i].name.substring(point + 1);
    mtime = file[i].mtime + "";
    if (name === "") {
      k++;
    } else {
      filearr[i - k] = {name, extension, mtime};
    }
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