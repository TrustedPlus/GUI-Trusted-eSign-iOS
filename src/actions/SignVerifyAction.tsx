import * as RNFS from "react-native-fs";
import { NativeModules, Alert } from "react-native";
import { readFiles } from "../actions/index";
import {
    SIGN_FILE, SIGN_FILE_SUCCESS, SIGN_FILE_ERROR, SIGN_FILE_END,
    VERIFY_SIGN, VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, VERIFY_SIGN_END
} from "../constants";

interface IFile {
    mtime: string;
    extension: string;
    extensionAll: string;
    name: string;
}

export function signFile(files: IFile[], personalCert, footer) {
    return function action(dispatch) {
        dispatch({ type: SIGN_FILE });
        if (personalCert.title === "") {
            dispatch({ type: SIGN_FILE_END });
        } else {
            for (let i = 0; i < footer.arrButton.length; i++) {
                let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
                RNFS.writeFile(path + ".sig", "", "utf8");
                NativeModules.Wrap_Signer.sign(
                    personalCert.serialNumber,
                    "My",
                    personalCert.provider,
                    path,
                    path + ".sig",
                    (err, signFile) => {
                        if (err) {
                            dispatch({ type: SIGN_FILE_ERROR, payload: err });
                        } else {
                            dispatch({ type: SIGN_FILE_SUCCESS, payload: files[footer.arrButton[i]].name });
                        }
                    });
            }
            dispatch({ type: SIGN_FILE_END });
            dispatch(readFiles());
        }
    };
}

export function verifySign(files: IFile[], personalCert, footer) {
    return function action(dispatch) {
        dispatch({ type: VERIFY_SIGN });
        if (personalCert.title === "") {
            dispatch({ type: VERIFY_SIGN_END });
        } else {
            for (let i = 0; i < footer.arrButton.length; i++) {
                let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
                const read = RNFS.read(path, 2, 0, "base64");
                read.then(
                    response => {
                        NativeModules.Wrap_Signer.verify(
                            path,
                            response === "--" ? "BASE64" : "DER",
                            (err, verify) => {
                                if (err) {
                                    dispatch({ type: VERIFY_SIGN_ERROR, payload: files[footer.arrButton[i]].name });
                                    Alert.alert(err);
                                } else {
                                    dispatch({ type: VERIFY_SIGN_SUCCESS, payload: files[footer.arrButton[i]].name });
                                }
                            });
                    },
                    err => Alert.alert("" + err));
            }
            dispatch({ type: VERIFY_SIGN_END });
        }
    };
}