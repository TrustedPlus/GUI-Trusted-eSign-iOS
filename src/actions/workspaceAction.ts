import { ADD_FILES_IN_WORKSPACE_SIGN, ADD_SINGLE_FILE_IN_WORKSPACE_SIGN, CLEAR_ORIGINAL_FILE_IN_WORKSPACE_SIGN, CLEAR_ALL_FILES_IN_WORKSPACE_SIGN,
	ADD_FILES_IN_WORKSPACE_ENC, ADD_SINGLE_FILE_IN_WORKSPACE_ENC, CLEAR_ORIGINAL_FILE_IN_WORKSPACE_ENC, CLEAR_ALL_FILES_IN_WORKSPACE_ENC,
	CLEAR_ALL_FILES_IN_ALL_WORKSPACE } from "../constants";

export function addFilesInWorkspaceSign(files, selectedFiles) {
	return function action(dispatch) {
		const arrSelectedFilesForSign = [];
		for (let i = 0; i < selectedFiles.arrNum.length; i++) {
			arrSelectedFilesForSign.push(files[selectedFiles.arrNum[i]]);
		}
		dispatch({
			type: ADD_FILES_IN_WORKSPACE_SIGN,
			payload: arrSelectedFilesForSign
		});
	};
}

export function addSingleFileInWorkspaceSign(file) {
	return function action(dispatch) {
		dispatch({
			type: ADD_SINGLE_FILE_IN_WORKSPACE_SIGN,
			payload: file
		});
	};
}

export function clearOriginalFileInWorkspaceSign(name, extensionAll) {
	return function action(dispatch) {
		dispatch({
			type: CLEAR_ORIGINAL_FILE_IN_WORKSPACE_SIGN,
			payload: {name, extensionAll}
		});
	};
}

export function clearAllFilesinWorkspaceSign() {
	return function action(dispatch) {
		dispatch({
			type: CLEAR_ALL_FILES_IN_WORKSPACE_SIGN
		});
	};
}

export function addFilesInWorkspaceEnc(files, selectedFiles) {
	return function action(dispatch) {
		const arrSelectedFilesForEnc = [];
		for (let i = 0; i < selectedFiles.arrNum.length; i++) {
			arrSelectedFilesForEnc.push(files[selectedFiles.arrNum[i]]);
		}
		dispatch({
			type: ADD_FILES_IN_WORKSPACE_ENC,
			payload: arrSelectedFilesForEnc
		});
	};
}

export function addSingleFileInWorkspaceEnc(file) {
	return function action(dispatch) {
		dispatch({
			type: ADD_SINGLE_FILE_IN_WORKSPACE_ENC,
			payload: file
		});
	};
}

export function clearOriginalFileInWorkspaceEnc(name, extensionAll) {
	return function action(dispatch) {
		dispatch({
			type: CLEAR_ORIGINAL_FILE_IN_WORKSPACE_ENC,
			payload: {name, extensionAll}
		});
	};
}

export function clearAllFilesinWorkspaceEnc() {
	return function action(dispatch) {
		dispatch({
			type: CLEAR_ALL_FILES_IN_WORKSPACE_ENC
		});
	};
}

export function clearAllFilesinAllWorkspace() {
	return function action(dispatch) {
		dispatch({
			type: CLEAR_ALL_FILES_IN_ALL_WORKSPACE
		});
	};
}