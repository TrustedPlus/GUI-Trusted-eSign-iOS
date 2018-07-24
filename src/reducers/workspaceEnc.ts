import {
	ADD_FILES_IN_WORKSPACE_ENC, ADD_SINGLE_FILE_IN_WORKSPACE_ENC, CLEAR_ORIGINAL_FILE_IN_WORKSPACE_ENC,
	CLEAR_ALL_FILES_IN_WORKSPACE_ENC, CLEAR_ALL_FILES_IN_ALL_WORKSPACE
} from "../constants";

const initialState = {
	files: []
};

export function workspaceEnc(state = initialState, action) {
	switch (action.type) {
		case ADD_FILES_IN_WORKSPACE_ENC:
			return {
				...state,
				files: action.payload,
			};
		case ADD_SINGLE_FILE_IN_WORKSPACE_ENC:
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
		case CLEAR_ORIGINAL_FILE_IN_WORKSPACE_ENC:
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
		case CLEAR_ALL_FILES_IN_WORKSPACE_ENC:
			return {
				...state,
				files: []
			};
		default:
			return state;
	}
}