import { ADD_FILES_IN_WORKSPACE_ENC } from "../constants";

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
		default:
			return state;
	}
}