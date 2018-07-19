import {
	READ_FILES, READ_FILES_SUCCESS, READ_FILES_ERROR,
	ADD_FILES, ADD_FILES_SUCCESS, ADD_FILES_ERROR,
	SIGN_FILE, SIGN_FILE_END,
	VERIFY_SIGN, VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, VERIFY_SIGN_END,
	ENCODE_FILES, ENCODE_FILES_END, DECODE_FILES, DECODE_FILES_END,
	UPLOAD_FILES, UPLOAD_FILES_END, DELETE_FILES, DELETE_FILES_END,
	CLEAR_FILES
} from "../constants";

const initialState = {
	files: [],
	isFetching: false,
};

function verySignSuccess(oldFiles, action) {
	for (let i = 0; i < oldFiles.length; i++) {
		if ((oldFiles[i].name === action.payload) && (oldFiles[i].extension === "sig")) {
			oldFiles[i].verify = 1;
			return oldFiles;
		}
	}
	return oldFiles;
}

function verySignError(oldFiles, action) {
	if (action.payload === 0) { return oldFiles; }
	for (let i = 0; i < oldFiles.length; i++) {
		if ((oldFiles[i].name === action.payload) && (oldFiles[i].extension === "sig")) {
			oldFiles[i].verify = -1;
			return oldFiles;
		}
	}
	return oldFiles;
}

export function Files(state = initialState, action) {
	switch (action.type) {
		case UPLOAD_FILES:
		case DELETE_FILES:
		case READ_FILES:
		case ADD_FILES:
		case SIGN_FILE:
		case VERIFY_SIGN:
		case ENCODE_FILES:
		case DECODE_FILES:
			return {
				...state,
				isFetching: true
			};
		case UPLOAD_FILES_END:
		case DELETE_FILES_END:
		case READ_FILES_ERROR:
		case ADD_FILES_SUCCESS:
		case ADD_FILES_ERROR:
		case SIGN_FILE_END:
		case ENCODE_FILES_END:
		case DECODE_FILES_END:
			return {
				...state,
				isFetching: false
			};
		case READ_FILES_SUCCESS:
			return {
				...state,
				files: action.payload,
				isFetching: false
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
		case VERIFY_SIGN_END:
			return {
				...state,
				files: state.files,
				isFetching: false
			};
		case CLEAR_FILES:
			return {
				...state,
				files: []
			};
		default:
			return state;
	}
}