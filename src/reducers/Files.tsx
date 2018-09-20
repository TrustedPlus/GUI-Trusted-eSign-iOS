import {
	READ_FILES, READ_FILES_SUCCESS, READ_FILES_ERROR,
	ADD_FILES, ADD_FILES_SUCCESS, ADD_FILES_ERROR,
	SIGN_FILE, SIGN_FILE_END,
	VERIFY_SIGN, VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, VERIFY_SIGN_END,
	ENCODE_FILES, ENCODE_FILES_END, DECODE_FILES, DECODE_FILES_END,
	UPLOAD_FILES, UPLOAD_FILES_END, DELETE_FILES, DELETE_FILES_END,
	CLEAR_FILES, FETCHING_SIGN_TRUE, FETCHING_SIGN_FALSE, FETCHING_ENC_TRUE, FETCHING_ENC_FALSE,
	FETCHING_DOC_TRUE, FETCHING_DOC_FALSE
} from "../constants";

const initialState = {
	files: [],
	isFetching: false,
	isFetchingSign: false,
	isFetchingEnc: false,
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

export function Files(state = initialState, action) {
	switch (action.type) {
		case VERIFY_SIGN:
			return {
				...state,
				isFetchingSign: true,
				isFetching: true
			};
		case VERIFY_SIGN:
			return {
				...state,
				isFetchingSign: true,
				isFetching: true
			};
		case SIGN_FILE:
			return {
				...state,
				isFetchingSign: true
			};
		case SIGN_FILE_END:
			return {
				...state,
				isFetchingSign: false
			};
		case FETCHING_SIGN_TRUE:
			return {
				...state,
				isFetchingSign: true
			};
		case FETCHING_SIGN_FALSE:
			return {
				...state,
				isFetchingSign: false
			};
		case FETCHING_ENC_TRUE:
			return {
				...state,
				isFetchingEnc: true
			};
		case FETCHING_ENC_FALSE:
			return {
				...state,
				isFetchingEnc: false
			};
		case FETCHING_DOC_TRUE:
			return {
				...state,
				isFetching: true
			};
		case FETCHING_DOC_FALSE:
			return {
				...state,
				isFetching: false
			};
		case UPLOAD_FILES:
			return {
				...state,
				isFetching: true,
				isFetchingSign: true,
				isFetchingEnc: true,
			};
		case UPLOAD_FILES_END:
			return {
				...state,
				isFetching: false,
				isFetchingSign: false,
				isFetchingEnc: false,
			};
		case DELETE_FILES:
		case READ_FILES:
		case ADD_FILES:
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
		case ENCODE_FILES_END:
		case DECODE_FILES_END:
			return {
				...state,
				isFetching: false
			};
		case READ_FILES_SUCCESS:
			function compareAge(file1, file2) {
				if (file1.name === file2.name) {
					if (file1.extension > file2.extension) { return 1; }
					if (file1.extension < file2.extension) { return -1; }
				}
				if (file1.name > file2.name) { return 1; }
				if (file1.name < file2.name) { return -1; }
			}

			action.payload.sort(compareAge);
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
				isFetching: false,
				isFetchingSign: false
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