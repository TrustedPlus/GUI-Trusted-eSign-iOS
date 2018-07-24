import * as RNFS from "react-native-fs";
import { Share } from "react-native";
import { readFiles } from "../actions/index";
import {
	UPLOAD_FILES, UPLOAD_FILES_SUCCESS, UPLOAD_FILES_ERROR, UPLOAD_FILES_END,
	DELETE_FILES, DELETE_FILES_SUCCESS, DELETE_FILES_ERROR, DELETE_FILES_END
} from "../constants";

interface IFile {
	mtime: string;
	extension: string;
	extensionAll: string;
	name: string;
}

interface ISelectedFiles {
	arrNum: Array<number>;
	arrExtension: Array<number>;
}

export function uploadFile(files: IFile[], selectedFiles: ISelectedFiles) {
	return function action(dispatch) {
		dispatch({ type: UPLOAD_FILES });
		Share.share({
			url: RNFS.DocumentDirectoryPath + "/Files/" + files[selectedFiles.arrNum[0]].name + "." + files[selectedFiles.arrNum[0]].extensionAll
		}).then(
			result => dispatch({ type: UPLOAD_FILES_SUCCESS, payload: files[selectedFiles.arrNum[0]].name + "." + files[selectedFiles.arrNum[0]].extensionAll })
		).catch(
			errorMsg => dispatch({ type: UPLOAD_FILES_ERROR, payload: files[selectedFiles.arrNum[0]].name + "." + files[selectedFiles.arrNum[0]].extensionAll, err: errorMsg })
		);
		dispatch({ type: UPLOAD_FILES_END });
	};
}

export function deleteFile(files: IFile[], selectedFiles: ISelectedFiles, clearselectedFiles: Function) {
	return function action(dispatch) {
		dispatch({ type: DELETE_FILES });
		for (let i = 0; i < selectedFiles.arrNum.length; i++) {
			let path;
			if (files[selectedFiles.arrNum[i]].extension) {
				path = RNFS.DocumentDirectoryPath + "/Files/" + files[selectedFiles.arrNum[i]].name + "." + files[selectedFiles.arrNum[i]].extensionAll;
			} else {
				path = RNFS.DocumentDirectoryPath + "/Files/" + files[selectedFiles.arrNum[i]].name;
			}
			RNFS.unlink(path)
				.then(() => {
					dispatch({ type: DELETE_FILES_SUCCESS, payload: files[selectedFiles.arrNum[i]].name + "." + files[selectedFiles.arrNum[0]].extensionAll });
				})
				.catch((err) => {
					dispatch({ type: DELETE_FILES_ERROR, payload:  + "." + files[selectedFiles.arrNum[0]].extensionAll, err });
				});
		}
		setTimeout(() => {
			dispatch(readFiles());
			clearselectedFiles();
		}, 300);
	};
}