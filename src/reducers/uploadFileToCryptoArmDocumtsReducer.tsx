import { ADD_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS, CLEAR_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS } from "../constants";

const initialState = {
	files: [
		{
			name: null,
			id: null,
			uploadurl: null,
			chrome: null
		}
	]
};

export function tempFiles(state = initialState, action) {
	switch (action.type) {
		case ADD_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS:
			return {
				...state,
				files: [{ name: action.payload.name, id: action.payload.id, uploadurl: action.payload.uploadurl, chrome: action.payload.browser }]
			};
		case CLEAR_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS:
			return {
				...state,
				files: [
					{
						name: null,
						id: null,
						uploadurl: null,
						chrome: null
					}
				]
			};
		default:
			return state;
	}
}