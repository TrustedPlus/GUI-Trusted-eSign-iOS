import * as RNFS from "react-native-fs";
import * as Share from "react-native-share";
import { showToast, showToastDanger } from "../utils/toast";
// import MultiShare from "react-native-multi-share";
import { readFiles } from ".";
import {
	UPLOAD_FILES, UPLOAD_FILES_SUCCESS, UPLOAD_FILES_ERROR, UPLOAD_FILES_END,
	DELETE_FILES, DELETE_FILES_SUCCESS, DELETE_FILES_ERROR, DELETE_FILES_END
} from "../constants";
import { addSingleFileInWorkspaceSign, clearOriginalFileInWorkspaceSign, clearAllFilesinWorkspaceEnc } from "./workspaceAction";
import { addSingleFileInWorkspaceEnc, clearOriginalFileInWorkspaceEnc, clearAllFilesinWorkspaceSign } from "./workspaceAction";

interface IFile {
	date: string;
	time: string;
	month: string;
	year: string;
	extension: string;
	extensionAll: string;
	name: string;
}

interface ISelectedFiles {
	arrNum: Array<number>;
	arrExtension: Array<number>;
}

export function uploadFile(files: IFile[], selectedFiles: ISelectedFiles, refreshingFiles: Function, page: string) {
	return function action(dispatch) {
		dispatch({ type: UPLOAD_FILES });
		let arrUrls = [];
		let path;
		let arrAddFilesInWorkspace = [];
		let arrDeletedFilesInWorkspae = [];
		for (let i = 0; i < selectedFiles.arrNum.length; i++) {
			path = RNFS.DocumentDirectoryPath + "/Files/" + files[selectedFiles.arrNum[i]].name;
			if (files[selectedFiles.arrNum[i]].extensionAll !== "") {
				path = path + "." + files[selectedFiles.arrNum[i]].extensionAll;
			}
			arrUrls.push(path);
			arrAddFilesInWorkspace.push({ name: files[selectedFiles.arrNum[i]].name, extensionAll: files[selectedFiles.arrNum[i]].extensionAll });
			arrDeletedFilesInWorkspae.push({ name: files[selectedFiles.arrNum[i]].name, extension: files[selectedFiles.arrNum[i]].extension, extensionAll: files[selectedFiles.arrNum[i]].extensionAll, date: files[selectedFiles.arrNum[i]].date, month: files[selectedFiles.arrNum[i]].month, year: files[selectedFiles.arrNum[i]].year, time: files[selectedFiles.arrNum[i]].time, verify: 0 });
		}
		const shareOptions = {
			urls: arrUrls,
		};
		Share.open(shareOptions)
			.then((res) => {
				switch (page) {
					case "sig":
						for (let i = 0; i < arrAddFilesInWorkspace.length; i++) {
							dispatch(clearOriginalFileInWorkspaceSign(arrAddFilesInWorkspace[i].name, arrAddFilesInWorkspace[i].extensionAll));
						}
						for (let i = 0; i < arrDeletedFilesInWorkspae.length; i++) {
							dispatch(addSingleFileInWorkspaceSign(arrDeletedFilesInWorkspae[i]));
						}
						break;
					case "enc":
						for (let i = 0; i < arrAddFilesInWorkspace.length; i++) {
							dispatch(clearOriginalFileInWorkspaceEnc(arrAddFilesInWorkspace[i].name, arrAddFilesInWorkspace[i].extensionAll));
						}
						for (let i = 0; i < arrDeletedFilesInWorkspae.length; i++) {
							dispatch(addSingleFileInWorkspaceEnc(arrDeletedFilesInWorkspae[i]));
						}
						break;
				}
				showToast("Файлы успешно экспортированы");
				refreshingFiles();
				dispatch({ type: UPLOAD_FILES_END });
			})
			.catch((err) => {
				switch (page) {
					case "sig":
						for (let i = 0; i < arrAddFilesInWorkspace.length; i++) {
							dispatch(clearOriginalFileInWorkspaceSign(arrAddFilesInWorkspace[i].name, arrAddFilesInWorkspace[i].extensionAll));
						}
						for (let i = 0; i < arrDeletedFilesInWorkspae.length; i++) {
							dispatch(addSingleFileInWorkspaceSign(arrDeletedFilesInWorkspae[i]));
						}
						break;
					case "enc":
						for (let i = 0; i < arrAddFilesInWorkspace.length; i++) {
							dispatch(clearOriginalFileInWorkspaceEnc(arrAddFilesInWorkspace[i].name, arrAddFilesInWorkspace[i].extensionAll));
						}
						for (let i = 0; i < arrDeletedFilesInWorkspae.length; i++) {
							dispatch(addSingleFileInWorkspaceEnc(arrDeletedFilesInWorkspae[i]));
						}
						break;
				}
				if (!(err.error.message === "Операция отменена." || err.error === "User did not share")) {
					showToastDanger("При экспорте произошла ошибка");
				}
				refreshingFiles();
				dispatch({ type: UPLOAD_FILES_END });
			});
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
					dispatch({ type: DELETE_FILES_ERROR, payload: + "." + files[selectedFiles.arrNum[0]].extensionAll, err });
				});
		}
		setTimeout(() => {
			dispatch(readFiles());
			clearselectedFiles();
		}, 300);
	};
}