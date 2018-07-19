import { ADD_FILES_IN_WORKSPACE_SIGN, ADD_SINGLE_FILE_IN_WORKSPACE_SIGN, CLEAR_ORIGINAL_FILE_IN_WORKSPACE_SIGN } from "../constants";

const initialState = {
	files: []
};

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
		default:
			return state;
	}
}