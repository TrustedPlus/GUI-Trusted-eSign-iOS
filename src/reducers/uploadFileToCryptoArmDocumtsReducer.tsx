import {
	ADD_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS, CLEAR_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS,
	VERIFY_SIGN_FILES_CRYPTOARMDOC_SUCCESS, VERIFY_SIGN_FILES_CRYPTOARMDOC_ERROR
} from "../constants";

const initialState = {
	tempFiles: {
		arrFiles: [],
		uploadurl: null,
		chrome: null,
		href: null,
		extra: null,
		footerMark: null
	}
};

function verySignSuccess(oldArrFiles, action) {
	oldArrFiles.forEach(
		(file, i) => {
			if (file.realname === action.payload) {
				oldArrFiles[i].verify = 1;
				return oldArrFiles;
			}
		}
	);
	return oldArrFiles;
}

function verySignError(oldArrFiles, action) {
	if (action.payload === 0) { return oldArrFiles; }
	oldArrFiles.forEach(
		(file, i) => {
			if (file.realname === action.payload) {
				oldArrFiles[i].verify = -1;
				return oldArrFiles;
			}
		}
	);
	return oldArrFiles;
}

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
					extra: action.payload.extra,
					footerMark: action.payload.footerMark
				}
			};
		case CLEAR_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS:
			return {
				...state,
				tempFiles: {
					arrFiles: [],
					uploadurl: null,
					chrome: null,
					href: null,
					extra: null,
					footerMark: null
				}
			};
		case VERIFY_SIGN_FILES_CRYPTOARMDOC_SUCCESS:
			return {
				...state,
				tempFiles: {
					...state.tempFiles,
					arrFiles: verySignSuccess(state.tempFiles.arrFiles.concat(), action)
				}
			};
		case VERIFY_SIGN_FILES_CRYPTOARMDOC_ERROR:
			return {
				...state,
				tempFiles: {
					...state.tempFiles,
					arrFiles: verySignError(state.tempFiles.arrFiles.concat(), action)
				}
			};
		default:
			return state;
	}
}