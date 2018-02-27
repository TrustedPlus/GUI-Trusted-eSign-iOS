import { FOOTER_ACTION, FOOTER_CLOSE, CERT_ACTION, SIGN_FILES,
  ENCRYPT_FILES, CREATE_FILES, CREATE_FILES_SUCCESS, CREATE_FILES_ERROR} from "../constants";
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

export function signFiles(id) {
  return {
    type: SIGN_FILES,
    payload: id
  };
}

export function encryptFiles(id) {
  return {
    type: ENCRYPT_FILES,
    payload: id
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
  // let path = RNFS.DocumentDirectoryPath + "/Files/Письмо\ от\ Андрея.txt";
  // write the file
  // RNFS.writeFile(path, "Какой то файл", "utf8");
}

export function createFilesSuccess(file) {
  console.log(file);
  let filearr, point, name, extension, mtime, path;
  let length = file.length;
  for (let i = 0; i < length; i++) {
    point = file[i].name.indexOf(".");
    name = file[i].name.substring(0, point);
    extension = file[i].name.substring(point + 1);
    mtime = file[i].mtime + "";
    path = file[i].path;
    filearr = {name, extension, mtime, path};
    file[i] = filearr;
  }
  return {
    type: CREATE_FILES_SUCCESS,
    payload: file
  };
}

export function createFilesError(error) {
  return {
    type: CREATE_FILES_ERROR,
    payload: error
  };
}