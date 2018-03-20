import { FOOTER_ACTION, FOOTER_CLOSE, PERSONAL_CERT_ACTION, OTHER_CERT_ACTION, CLEAR_LOG,
  READ_FILES, READ_FILES_SUCCESS, READ_FILES_ERROR,
  ADD_FILES, ADD_FILES_SUCCESS, ADD_FILES_ERROR} from "../constants";
import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";

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

export function personalCertAdd(title, img, note, extension) {
  return {
    type: PERSONAL_CERT_ACTION,
    payload: [title, img, note, extension]
  };
}

export function otherCertAdd(title, img, note, extension) {
  return {
    type: OTHER_CERT_ACTION,
    payload: [title, img, note, extension]
  };
}

export function readFiles() {
  return function action(dispatch) {
    dispatch({type: READ_FILES});
    /*var path = RNFS.DocumentDirectoryPath + '/test.txt';
    RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')*/
    const request = RNFS.readDir(RNFS.DocumentDirectoryPath + "/Files");

    return request.then(
      response => dispatch(readFilesSuccess(response)),
      err => dispatch({type: READ_FILES_ERROR})
    );
  };
}

export function readFilesSuccess(file) {
  return function action(dispatch) {
    let filearr = [], point, name, extension, date, month, year, hours, minutes, time, seconds, verify = 0;
    let length = file.length;
    let k = 0;
    for (let i = 0; i < length; i++) {
      point = file[i].name.indexOf(".");
      name = file[i].name.substring(0, point);
      extension = file[i].name.substring(point + 1);
      date = file[i].mtime.getDate();
      month = file[i].mtime.getMonth();
      switch (month) {
        case 0: month = "января"; break;
        case 1: month = "февраля"; break;
        case 2: month = "марта"; break;
        case 3: month = "апреля"; break;
        case 4: month = "мая"; break;
        case 5: month = "июня"; break;
        case 6: month = "июля"; break;
        case 7: month = "августа"; break;
        case 8: month = "сентября"; break;
        case 9: month = "октября"; break;
        case 10: month = "ноября"; break;
        case 11: month = "декабря"; break;
        default: break;
      }
      year = file[i].mtime.getFullYear();
      hours = "" + file[i].mtime.getHours();
      if (hours.length === 1) hours = "0" + hours;
      minutes = "" + file[i].mtime.getMinutes();
      if (minutes.length === 1) minutes = "0" + minutes;
      seconds = "" + file[i].mtime.getSeconds();
      if (seconds.length === 1) seconds = "0" + seconds;
      if (name === "") {
        k++;
      } else {
        filearr[i - k] = {name, extension, date, month, year, hours, minutes, seconds, verify};
      }
    }
    dispatch({type: READ_FILES_SUCCESS, payload: filearr});
    dispatch(footerClose());
  };
}

export function clearLog() {
  return {
    type: CLEAR_LOG
  };
}

export function addFiles(uri, type, fileName, fileSize) {
  return function action(dispatch) {
    dispatch({type: ADD_FILES});
    let point, name;
    point = fileName.indexOf(".");
    name = fileName.substring(0, point);
    console.log(decodeURIComponent(uri.replace("file:///", "/")));
    const copyFile = RNFS.copyFile(decodeURIComponent(uri.replace("file:///", "/")), RNFS.DocumentDirectoryPath + "/Files/" + fileName);
    return copyFile.then(
      response => {
        dispatch({type: ADD_FILES_SUCCESS, payload: name});
        dispatch(readFiles());
      },
      err => dispatch({type: ADD_FILES_ERROR, payload: name})
    );
  };
}