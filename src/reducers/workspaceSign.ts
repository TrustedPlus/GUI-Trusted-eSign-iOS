import {
	ADD_FILES_IN_WORKSPACE_SIGN, ADD_SINGLE_FILE_IN_WORKSPACE_SIGN, CLEAR_ORIGINAL_FILE_IN_WORKSPACE_SIGN,
	CLEAR_ALL_FILES_IN_WORKSPACE_SIGN, VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, CLEAR_ALL_FILES_IN_ALL_WORKSPACE
} from "../constants";

const initialState = {
	files: []
};

function verySignSuccess(oldFiles, action) {
	for (let i = 0; i < oldFiles.length; i++) {
		if ((oldFiles[i].name + "." + oldFiles[i].extensionAll === action.payload) && (oldFiles[i].extension === "sig")) {
			oldFiles[i].verify = 1;
			return oldFiles;
		}
	}
	return oldFiles;
}

function verySignError(oldFiles, action) {
	if (action.payload === 0) { return oldFiles; }
	for (let i = 0; i < oldFiles.length; i++) {
		if ((oldFiles[i].name + "." + oldFiles[i].extensionAll === action.payload) && (oldFiles[i].extension === "sig")) {
			oldFiles[i].verify = -1;
			return oldFiles;
		}
	}
	return oldFiles;
}

export function workspaceSign(state = initialState, action) {
	switch (action.type) {
		case ADD_FILES_IN_WORKSPACE_SIGN:
			return {
				...state,
				files: action.payload,
			};
		case ADD_SINGLE_FILE_IN_WORKSPACE_SIGN:
			let oldFiles = state.files.concat();
			let isAdd = true;
			state.files.forEach((file, i) => {
				if (file.name === action.payload.name && file.extensionAll === action.payload.extensionAll) {
					isAdd = false;
					oldFiles[i] = action.payload;
				}
			});
			if (isAdd) {
				oldFiles.push(action.payload);
			}
			return {
				...state,
				files: oldFiles
			};
		case CLEAR_ORIGINAL_FILE_IN_WORKSPACE_SIGN:
			oldFiles = state.files.concat();
			state.files.forEach((file, i) => {
				if (file.name === action.payload.name && file.extensionAll === action.payload.extensionAll) {
					oldFiles.splice(i, 1);
				}
			});
			return {
				...state,
				files: oldFiles
			};
		case CLEAR_ALL_FILES_IN_ALL_WORKSPACE:
		case CLEAR_ALL_FILES_IN_WORKSPACE_SIGN:
			return {
				...state,
				files: []
			};
		case VERIFY_SIGN_SUCCESS:
			return {
				...state,
				files: verySignSuccess(state.files.concat(), action)
			};
		case VERIFY_SIGN_ERROR:
			return {
				...state,
				files: verySignError(state.files.concat(), action)
			};
		default:
			return state;
	}
}