import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";
import {readFiles} from "../actions/index";
import { SIGN_FILE, SIGN_FILE_SUCCESS, SIGN_FILE_ERROR, SIGN_FILE_END,
         VERIFY_SIGN, VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, VERIFY_SIGN_END} from "../constants";

interface IFile {
    mtime: string;
    extension: string;
    name: string;
}

export function signFile(files: IFile[], personalCert, footer) {
    return function action(dispatch) {
        dispatch({type: SIGN_FILE});
        if (personalCert.title === "") {
            dispatch({type: SIGN_FILE_END});
        } else {
            for (let i = 0; i < footer.arrButton.length; i++) {
                let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
                RNFS.writeFile(path + ".sig", "", "utf8");
                NativeModules.WSigner.signFile(
                    personalCert.issuerName,
                    personalCert.serialNumber,
                            path + "." + files[footer.arrButton[i]].extension,
                            path + ".sig",
                            (err, signFile) => {
                                if (err === null) {
                                    dispatch({type: SIGN_FILE_SUCCESS, payload: files[footer.arrButton[i]].name});
                                } else {
                                    dispatch({type: SIGN_FILE_ERROR, payload: files[footer.arrButton[i]].name});
                                }
                                if (i + 1 === footer.arrButton.length) {
                                    dispatch({type: SIGN_FILE_END});
                                    dispatch(readFiles());
                                }
                            });
            }
        }
    };
}

export function verifySign(files: IFile[], personalCert, footer) {
    return function action(dispatch) {
        dispatch({type: VERIFY_SIGN});
        if (personalCert.title === "") {
            dispatch({type: VERIFY_SIGN_END});
        } else {
            for (let i = 0; i < footer.arrButton.length; i++) {
                let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
                NativeModules.WSigner.verifySign(
                    personalCert.issuerName,
                    personalCert.serialNumber,
                            path + "." + files[footer.arrButton[i]].extension,
                            (err, verify) => {
                                if (err === null) {
                                    dispatch({type: VERIFY_SIGN_SUCCESS, payload: files[footer.arrButton[i]].name});
                                } else {
                                    dispatch({type: VERIFY_SIGN_ERROR, payload: files[footer.arrButton[i]].name});
                                }
                                if (i + 1 === footer.arrButton.length) {
                                    dispatch({type: VERIFY_SIGN_END});
                                }
                        });
            }
        }
    };
}