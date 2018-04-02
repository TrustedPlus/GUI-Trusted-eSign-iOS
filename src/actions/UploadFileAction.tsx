import * as RNFS from "react-native-fs";
import { NativeModules, Share } from "react-native";
import { readFiles } from "../actions/index";
import { UPLOAD_FILES, UPLOAD_FILES_SUCCESS, UPLOAD_FILES_ERROR, UPLOAD_FILES_END } from "../constants";

interface IFile {
    mtime: string;
    extension: string;
    name: string;
}

export function uploadFile(files: IFile[], footer) {
    return function action(dispatch) {
        dispatch({ type: UPLOAD_FILES });
        if (files.length === 0) {
            return dispatch({ type: UPLOAD_FILES_END });
        } else {
            for (let i = 0; i < footer.arrButton.length; i++) {
                let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
                /*NativeModules.WCipher.encrypt(
                    otherCert.serialNumber,
                    "MY",
                    path + "." + files[footer.arrButton[i]].extension,
                    path + ".enc",
                    (err, encrypt) => {
                        if (err === null) {
                            dispatch({ type: UPLOAD_FILES_SUCCESS, payload: files[footer.arrButton[i]].name });
                        } else {
                            dispatch({ type: UPLOAD_FILES_ERROR, payload: files[footer.arrButton[i]].name });
                        }
                        if (i + 1 === footer.arrButton.length) {
                            dispatch({ type: UPLOAD_FILES_END });
                            dispatch(readFiles());
                        }
                    });*/
                    Share.share({
                        // message: "BAM: we're helping your business with awesome React Native apps",
                        url: RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extension,
                        // title: "Wow, did you see that?"
                    }).then(
                        result => dispatch({ type: UPLOAD_FILES_SUCCESS, payload: files[footer.arrButton[i]].name })
                    ).catch(
                        errorMsg => dispatch({ type: UPLOAD_FILES_ERROR, payload: errorMsg })
                    ); /*, {
                        // Android only:
                        // dialogTitle: "Share BAM goodness",
                        // iOS only:
                        // excludedActivityTypes: ["com.apple.UIKit.activity.PostToTwitter"]
                      });*/
            }
            dispatch({type: UPLOAD_FILES_END});
        }
    };
}