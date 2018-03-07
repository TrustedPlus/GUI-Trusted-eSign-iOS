import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";
import { SIGN_FILE, SIGN_FILE_SUCCESS, SIGN_FILE_ERROR, VERIFY_SIGN,
    VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR} from "../constants";

interface IFile {
    mtime: string;
    extension: string;
    name: string;
}

export function signFile(files: IFile[], personalCert, footer) {
    return function action(dispatch) {
        dispatch({type: SIGN_FILE});
        if (personalCert.title === "") return {type: SIGN_FILE_ERROR};
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
            RNFS.writeFile(path + ".sig", "", "utf8");
            let format;
            switch (personalCert.extension) {
                case "cer":
                    format = "DER";
                    break;
                case "crt":
                    format = "BASE64";
                    break;
                default: break;
            }
            NativeModules.WSigner.signFile(RNFS.DocumentDirectoryPath + "/PersonalCertKeys/" + personalCert.title + "." + personalCert.extension,
                        format,
                        RNFS.DocumentDirectoryPath + "/PersonalCertKeys/" + personalCert.title + ".key", format,
                        path + "." + files[footer.arrButton[i]].extension,
                        path + ".sig",
                        (err, signFile) => {
                            if (err === null) {
                                dispatch({type: SIGN_FILE_SUCCESS});
                            } else {
                                dispatch({type: SIGN_FILE_ERROR});
                            }
                        });
        }
    };
}

export function verifySign(files: IFile[], personalCert, footer) {
    return function action(dispatch) {
        dispatch({type: VERIFY_SIGN});
        if (personalCert.title === "") return {type: VERIFY_SIGN_ERROR, payload: 0};
        let format;
        switch (personalCert.extension) {
            case "cer":
                format = "DER";
                break;
            case "crt":
                format = "BASE64";
                break;
            default: break;
        }
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
            NativeModules.WSigner.verifySign(RNFS.DocumentDirectoryPath + "/PersonalCertKeys/" + personalCert.title + "." + personalCert.extension,
                        format,
                        path + "." + files[footer.arrButton[i]].extension,
                        (err, verify) => {
                            if (err === null) {
                                dispatch({type: VERIFY_SIGN_SUCCESS, payload: files[footer.arrButton[i]].name});
                            } else {
                                dispatch({type: VERIFY_SIGN_ERROR, payload: files[footer.arrButton[i]].name});
                            }
                    });
        }
    };
}