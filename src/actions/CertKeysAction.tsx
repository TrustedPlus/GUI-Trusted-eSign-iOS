import { READ_CERT_KEY, READ_PERSONAL_CERT_KEY_SUCCESS, READ_OTHER_CERT_KEY_SUCCESS, READ_CERT_KEY_ERROR} from "../constants";
import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";

export function readCertKeys() {
  return function action(dispatch) {
    dispatch({type: READ_CERT_KEY});
    NativeModules.CertsList.pathToStore(
      "/Users/dev/Downloads/Users\ 9/admin/Desktop/Prototype_Trusted_IOS/ios/tests/store",
      (err, label) => {
      null;
    });
    NativeModules.CertsList.showCerts(
      (err, label) => {
        if (label.length) {
          dispatch({type: READ_PERSONAL_CERT_KEY_SUCCESS, payload: label});
        } else {
          dispatch({type: READ_CERT_KEY_ERROR});
        }
    });
  };
}