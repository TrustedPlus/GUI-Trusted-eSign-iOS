import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";
import {readFiles} from "../actions/index";
import { ENCODE_FILES, ENCODE_FILES_SUCCESS, ENCODE_FILES_ERROR, ENCODE_FILES_END,
    DECODE_FILES, DECODE_FILES_SUCCESS, DECODE_FILES_ERROR, DECODE_FILES_END} from "../constants";

interface IFile {
    mtime: string;
    extension: string;
    name: string;
}

export function EncAssymmetric(files: IFile[], otherCert, footer) {
    return function action(dispatch) {
        dispatch({type: ENCODE_FILES});
        // if (otherCert.title === "") return dispatch({type: ENCODE_FILES_END});
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
            RNFS.writeFile(path + ".enc", "", "utf8");
            NativeModules.WCipher.EncAssymmetric(path + "." + files[footer.arrButton[i]].extension,
                            path + ".enc",
                            "/1.2.840.113549.1.9.1=pfx@gmail.com/2.5.4.6=RU/2.5.4.8=pfx_obl/2.5.4.7=pfx_gor/2.5.4.10=pfx_org/2.5.4.3=pfx",
                            "295B3C3E989D82DC",
                            (err, encrypt) => {
                                if (err === null) {
                                    dispatch({type: ENCODE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name});
                                } else {
                                    dispatch({type: ENCODE_FILES_ERROR, payload: files[footer.arrButton[i]].name});
                                }
                                if (i + 1 === footer.arrButton.length) {
                                    dispatch({type: ENCODE_FILES_END});
                                    dispatch(readFiles());
                                }
                            });
        }
    };
}

export function DecAssymmetric(files: IFile[], otherCert, footer) {
    return function action(dispatch) {
        dispatch({type: DECODE_FILES});
        // if (otherCert.title === "") return dispatch({type: DECODE_FILES_END});
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
            RNFS.writeFile(path + ".txt", "", "utf8");
            NativeModules.WCipher.DecAssymmetric(path + "." + files[footer.arrButton[i]].extension,
                            path + ".txt",
                            "/1.2.840.113549.1.9.1=pfx@gmail.com/2.5.4.6=RU/2.5.4.8=pfx_obl/2.5.4.7=pfx_gor/2.5.4.10=pfx_org/2.5.4.3=pfx",
                            "295B3C3E989D82DC",
                            (err, decrypt) => {
                                if (err === null) {
                                    dispatch({type: DECODE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name});
                                } else {
                                    dispatch({type: DECODE_FILES_ERROR, payload: files[footer.arrButton[i]].name});
                                }
                                if (i + 1 === footer.arrButton.length) {
                                    dispatch({type: DECODE_FILES_END});
                                    dispatch(readFiles());
                                }
                            });
        }
    };
}