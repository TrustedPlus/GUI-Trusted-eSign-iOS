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
            if (personalCert.provider === "CRYPTOPRO") {
                for (let i = 0; i < footer.arrButton.length; i++) {
                    let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
                    RNFS.writeFile(path + "." + files[footer.arrButton[i]].extensionAll + ".sig", "", "utf8");
                    NativeModules.PSigner.sign(
                        personalCert.serialNumber,
                        "MY",
                        path + "." + files[footer.arrButton[i]].extensionAll,
                        path + "." + files[footer.arrButton[i]].extensionAll + ".sig",
                        (err, signFile) => {
                            if (err) {
                                dispatch({ type: SIGN_FILE_ERROR, payload: err });
                            } else {
                                dispatch({ type: SIGN_FILE_SUCCESS, payload: files[footer.arrButton[i]].name });
                            }
                        });
                }
            } else {
                for (let i = 0; i < footer.arrButton.length; i++) {
                    let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
                    RNFS.writeFile(path + ".sig", "", "utf8");
                    NativeModules.WSigner.sign(
                        personalCert.serialNumber,
                        "MY",
                        path + "." + files[footer.arrButton[i]].extensionAll,
                        path + "." + files[footer.arrButton[i]].extensionAll + ".sig",
                        (err, signFile) => {
                            if (err) {
                                dispatch({ type: SIGN_FILE_ERROR, payload: err });
                            } else {
                                dispatch({ type: SIGN_FILE_SUCCESS, payload: files[footer.arrButton[i]].name });
                            }
                        });
                }
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
            if (personalCert.provider === "CRYPTOPRO") {
                for (let i = 0; i < footer.arrButton.length; i++) {
                    if (files[footer.arrButton[i]].extension !== "sig") { Alert.alert("Файл '" + files[footer.arrButton[i]].name + "' не является подписью"); continue; }
                    let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
                    NativeModules.PSigner.verify(
                        personalCert.serialNumber,
                        "MY",
                        path + "." + files[footer.arrButton[i]].extensionAll,
                        (err, verify) => {
                            if (err) {
                                dispatch({ type: VERIFY_SIGN_ERROR, payload: files[footer.arrButton[i]].name });
                            } else {
                                dispatch({ type: VERIFY_SIGN_SUCCESS, payload: files[footer.arrButton[i]].name });
                            }
                        });
                }
            } else {
                for (let i = 0; i < footer.arrButton.length; i++) {
                    if (files[footer.arrButton[i]].extension !== "sig") { Alert.alert("Файл '" + files[footer.arrButton[i]].name + "' не является подписью"); continue; }
                    let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
                    NativeModules.WSigner.verify(
                        personalCert.serialNumber,
                        "MY",
                        path + "." + files[footer.arrButton[i]].extensionAll,
                        (err, verify) => {
                            if (err) {
                                dispatch({ type: VERIFY_SIGN_ERROR, payload: files[footer.arrButton[i]].name });
                            } else {
                                dispatch({ type: VERIFY_SIGN_SUCCESS, payload: files[footer.arrButton[i]].name });
                            }
                        });
                }
            }
            dispatch({ type: VERIFY_SIGN_END });
        }
    };
}