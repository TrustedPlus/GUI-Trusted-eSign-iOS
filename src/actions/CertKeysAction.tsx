import { READ_CERT_KEY, READ_PERSONAL_CERT_KEY_SUCCESS, READ_OTHER_CERT_KEY_SUCCESS, READ_CERT_KEY_ERROR} from "../constants";
import * as RNFS from "react-native-fs";

export function readCertKeys(path) {
  return function action(dispatch) {
    dispatch({type: READ_CERT_KEY});
    let request;
    if (path === "sig") request = RNFS.readDir(RNFS.DocumentDirectoryPath + "/PersonalCertKeys");
    else if (path === "enc") request = RNFS.readDir(RNFS.DocumentDirectoryPath + "/OtherCertKeys");
    return request.then(
      response => dispatch(readCertKeysSuccess(response, path)),
      err => dispatch(readCertKeysError(err))
    );
  };
}

export function readCertKeysSuccess(file, path) {
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
  if (path === "sig") {
    return {
    type: READ_PERSONAL_CERT_KEY_SUCCESS,
    payload: filearr
    };
  } else if (path === "enc") {
    return {
      type: READ_OTHER_CERT_KEY_SUCCESS,
      payload: filearr
    };
  }
}

export function readCertKeysError(error) {
  return {
    type: READ_CERT_KEY_ERROR,
    payload: error
  };
}