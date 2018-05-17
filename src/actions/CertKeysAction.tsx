import { READ_CERT_KEY, READ_CERTIFICATES_SUCCESS, READ_CERTIFICATES_ERROR, CREATE_CERTIFICATE_SUCCESS, PROVIDER_INIT_ERROR} from "../constants";
import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";

export function readCertKeys() {
    return function action(dispatch) {
        dispatch({ type: READ_CERT_KEY });
        NativeModules.Wrap_Main.getCertificates(
            (err, label) => {
                if (err) {
                    dispatch({ type: READ_CERTIFICATES_ERROR, payload: err });
                } else {
                    dispatch({ type: READ_CERTIFICATES_SUCCESS, payload: label });
                }
            });
    };
}

export function createCert(CN) {
    return function action(dispatch) {
        dispatch({ type: CREATE_CERTIFICATE_SUCCESS, payload: CN });
    };
}