import { READ_CERT_KEY, READ_CERT_KEY_SUCCESS, READ_CERT_KEY_ERROR} from "../constants";
import * as RNFS from "react-native-fs";

export function readCertKeys() {
  return function action(dispatch) {
    dispatch({type: READ_CERT_KEY});
    const request = RNFS.readDir(RNFS.DocumentDirectoryPath + "/CertKeys");

    return request.then(
      response => dispatch(readCertKeysSuccess(response)),
      err => dispatch(readCertKeysError(err))
    );
  };
}

export function readCertKeysSuccess(file) {
  let filearr = [], point, name, extension, mtime;
  let length = file.length;
  let k = 0; // количество файлов, которые не нужно отображать
  for (let i = 0; i < length; i++) {
    point = file[i].name.indexOf(".");
    name = file[i].name.substring(0, point);
    extension = file[i].name.substring(point + 1);
    mtime = file[i].mtime + "";
    if (name === "") {
      k++;
    } else if (extension === "key") {
      k++;
    } else {
      filearr[i - k] = {name, extension, mtime};
    }
  }
  return {
    type: READ_CERT_KEY_SUCCESS,
    payload: filearr
  };
}

export function readCertKeysError(error) {
  return {
    type: READ_CERT_KEY_ERROR,
    payload: error
  };
}