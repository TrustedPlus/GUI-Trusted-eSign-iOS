import * as RNFS from "react-native-fs";
import { NativeModules, Alert } from "react-native";
import { readFiles } from "../actions/index";
import {
    ENCODE_FILES, ENCODE_FILES_SUCCESS, ENCODE_FILES_ERROR, ENCODE_FILES_END,
    DECODE_FILES, DECODE_FILES_SUCCESS, DECODE_FILES_ERROR, DECODE_FILES_END
} from "../constants";

interface IFile {
    mtime: string;
    extension: string;
    extensionAll: string;
    name: string;
}

export function encAssymmetric(files: IFile[], otherCert, footer) {
    return function action(dispatch) {
        dispatch({ type: ENCODE_FILES });
        if (otherCert.title === "") {
            return dispatch({ type: ENCODE_FILES_END });
        } else {
            for (let i = 0; i < footer.arrButton.length; i++) {
                let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
                RNFS.writeFile(path + ".enc", "", "utf8");
                NativeModules.Wrap_Cipher.encrypt(
                    otherCert.serialNumber,
                    "MY",
                    otherCert.provider,
                    path,
                    path + ".enc",
                    (err, encrypt) => {
                        if (err) {
                            Alert.alert(err);
                            dispatch({ type: ENCODE_FILES_ERROR, payload: err });
                        } else {
                            dispatch({ type: ENCODE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name });
                        }
                    });
            }
            dispatch({ type: ENCODE_FILES_END });
            dispatch(readFiles());
        }
    };
}

export function decAssymmetric(files: IFile[], otherCert, footer) {
    return function action(dispatch) {
        dispatch({ type: DECODE_FILES });
        if (otherCert.title === "") {
            return dispatch({ type: DECODE_FILES_END });
        } else {
            for (let i = 0; i < footer.arrButton.length; i++) {
                let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
                let point = files[footer.arrButton[i]].extensionAll.lastIndexOf(".");
                let extension = files[footer.arrButton[i]].extensionAll.substring(0, point);
                RNFS.writeFile(path + "." + extension, "", "utf8");
                NativeModules.Wrap_Cipher.decrypt(
                    otherCert.serialNumber,
                    "MY",
                    otherCert.provider,
                    path + "." + files[footer.arrButton[i]].extensionAll,
                    path + "." + extension,
                    (err, decrypt) => {
                        if (err) {
                            Alert.alert(err);
                            dispatch({ type: DECODE_FILES_ERROR, payload: err });
                        } else {
                            dispatch({ type: DECODE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name });
                        }
                    });
            }
        }
        dispatch({ type: DECODE_FILES_END });
        dispatch(readFiles());
    };
}