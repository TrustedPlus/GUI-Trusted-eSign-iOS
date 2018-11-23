import { ADD_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS, CLEAR_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS } from "../constants";

const initialState = {
	tempFiles: {
		arrFiles: null,
		uploadurl: null,
		chrome: null,
		href: null,
		extra: null
	}
};

export function tempFilesFunction(state = initialState, action) {
	switch (action.type) {
		case ADD_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS:
			return {
				...state,
				tempFiles: {
					arrFiles: action.payload.arrFiles,
					uploadurl: action.payload.uploadurl,
					chrome: action.payload.browser,
					href: action.payload.href,
					extra: action.payload.extra
				}
			};
		case CLEAR_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS:
			return {
				...state,
				tempFiles: {
					arrFiles: null,
					uploadurl: null,
					chrome: null,
					href: null,
					extra: null
				}
			};
		default:
			return state;
	}
}