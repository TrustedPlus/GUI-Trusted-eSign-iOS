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

export function uploadFile(files: IFile[], footer) {
	return function action(dispatch) {
		dispatch({ type: UPLOAD_FILES });
		for (let i = 0; i < footer.arrButton.length; i++) {
			Share.share({
				url: RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll
			}).then(
				result => dispatch({ type: UPLOAD_FILES_SUCCESS, payload: files[footer.arrButton[i]].name })
			).catch(
				errorMsg => dispatch({ type: UPLOAD_FILES_ERROR, payload: errorMsg })
			);
		}
		dispatch({ type: UPLOAD_FILES_END });
	};
}

export function deleteFile(files: IFile[], footer) {
	return function action(dispatch) {
		dispatch({ type: DELETE_FILES });
		for (let i = 0; i < footer.arrButton.length; i++) {
			let path;
			if (files[footer.arrButton[i]].extension) {
				path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
			} else {
				path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
			}
			RNFS.unlink(path)
				.then(() => {
					dispatch({ type: DELETE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name });
				})
				.catch((err) => {
					dispatch({ type: DELETE_FILES_ERROR, payload: err });
				});
		}
		setTimeout(() => {
			dispatch(readFiles());
		}, 300);
	};
}