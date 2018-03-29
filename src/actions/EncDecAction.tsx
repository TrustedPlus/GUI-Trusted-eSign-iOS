import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";
import { readFiles } from "../actions/index";
import {
    ENCODE_FILES, ENCODE_FILES_SUCCESS, ENCODE_FILES_ERROR, ENCODE_FILES_END,
    DECODE_FILES, DECODE_FILES_SUCCESS, DECODE_FILES_ERROR, DECODE_FILES_END
} from "../constants";

interface IFile {
    mtime: string;
    extension: string;
    name: string;
}

export function EncAssymmetric(files: IFile[], otherCert, footer) {
    return function action(dispatch) {
        dispatch({ type: ENCODE_FILES });
        if (otherCert.title === "") {
            return dispatch({ type: ENCODE_FILES_END });
        } else {
            for (let i = 0; i < footer.arrButton.length; i++) {
                let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
                RNFS.writeFile(path + ".enc", "", "utf8");
                NativeModules.WCipher.encrypt(
                    otherCert.serialNumber,
                    "MY",
                    path + "." + files[footer.arrButton[i]].extension,
                    path + ".enc",
                    (err, encrypt) => {
                        if (err === null) {
                            dispatch({ type: ENCODE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name });
                        } else {
                            dispatch({ type: ENCODE_FILES_ERROR, payload: files[footer.arrButton[i]].name });
                        }
                        if (i + 1 === footer.arrButton.length) {
                            dispatch({ type: ENCODE_FILES_END });
                            dispatch(readFiles());
                        }
                    });
            }
        }
    };
}

export function DecAssymmetric(files: IFile[], otherCert, footer) {
    return function action(dispatch) {
        dispatch({ type: DECODE_FILES });
        if (otherCert.title === "") {
            return dispatch({ type: DECODE_FILES_END });
        } else {
            for (let i = 0; i < footer.arrButton.length; i++) {
                let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
                RNFS.writeFile(path + ".txt", "", "utf8");
                NativeModules.WCipher.decrypt(
                    otherCert.serialNumber,
                    "MY",
                    path + "." + files[footer.arrButton[i]].extension,
                    path + ".txt",
                    (err, decrypt) => {
                        if (err === null) {
                            dispatch({ type: DECODE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name });
                        } else {
                            dispatch({ type: DECODE_FILES_ERROR, payload: files[footer.arrButton[i]].name });
                        }
                        if (i + 1 === footer.arrButton.length) {
                            dispatch({ type: DECODE_FILES_END });
                            dispatch(readFiles());
                        }
                    });
            }
        }
    };
}