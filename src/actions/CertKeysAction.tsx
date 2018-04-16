import { READ_CERT_KEY, READ_PERSONAL_CERT_KEY_SUCCESS, READ_OTHER_CERT_KEY_SUCCESS, READ_CERT_KEY_ERROR, SET_PATH_TO_STOR_ERROR, PROVIDER_INIT_ERROR} from "../constants";
import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";

export function readCertKeys() {
    return function action(dispatch) {
        dispatch({ type: READ_CERT_KEY });
        NativeModules.Test.getCertificates(
            (err, label) => {
                if (err) {
                    dispatch({ type: READ_CERT_KEY_ERROR, payload: err });
                } else {
                    dispatch({ type: READ_PERSONAL_CERT_KEY_SUCCESS, payload: label });
                }
            });
    };
}