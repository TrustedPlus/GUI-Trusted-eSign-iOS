import { AnyAction } from "redux";
import { CHANGE_FILTER } from "../constants";
import {
	ADD_FILES_SUCCESS, ADD_FILES_ERROR, SIGN_FILE_ERROR, SIGN_FILE_SUCCESS,
	VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, ENCODE_FILES_SUCCESS, ENCODE_FILES_ERROR,
	DECODE_FILES_SUCCESS, DECODE_FILES_ERROR, ADD_CERT_SUCCESS, ADD_CERT_ERROR, ADD_KEY_SUCCESS, ADD_KEY_ERROR,
	SET_PATH_TO_STOR_ERROR, PROVIDER_INIT_ERROR, READ_CERTIFICATES_ERROR, UPLOAD_FILES_SUCCESS, UPLOAD_FILES_ERROR,
	DELETE_FILES_SUCCESS, DELETE_FILES_ERROR, CREATE_CERTIFICATE_SUCCESS, DELETE_CERTIFICATE_SUCCESS,
	CREATE_REQUEST_SUCCESS
} from "../constants";

const initialState = {
	filterEnabled: false,
	SelectedFilters: {
		sign: false,
		addSign: false,
		enc: false,
		dec: false,
		createRequest: false,
		installCert: false,
		deleteCert: false,
		addFile: false,
		deleteFile: false
	},
	data1: new Date(2018, 0, 1),
	data2: null,
	filename: ""
};

export function filter(state = initialState, action: AnyAction) {
	switch (action.type) {
		case CHANGE_FILTER:
			return {
				...state,
				filterEnabled: action.payload.filterEnabled,
				SelectedFilters: action.payload.SelectedFilters,
				data1: action.payload.data1,
				data2: action.payload.data2,
				filename: action.payload.filename
			};
		case CREATE_REQUEST_SUCCESS:
		case SET_PATH_TO_STOR_ERROR:
		case UPLOAD_FILES_SUCCESS:
		case UPLOAD_FILES_ERROR:
		case DELETE_FILES_SUCCESS:
		case DELETE_FILES_ERROR:
		case PROVIDER_INIT_ERROR:
		case READ_CERTIFICATES_ERROR:
		case ADD_FILES_SUCCESS:
		case ADD_FILES_ERROR:
		case ADD_CERT_SUCCESS:
		case ADD_CERT_ERROR:
		case ADD_KEY_SUCCESS:
		case ADD_KEY_ERROR:
		case SIGN_FILE_ERROR:
		case SIGN_FILE_SUCCESS:
		case VERIFY_SIGN_SUCCESS:
		case VERIFY_SIGN_ERROR:
		case ENCODE_FILES_SUCCESS:
		case ENCODE_FILES_ERROR:
		case DECODE_FILES_SUCCESS:
		case DECODE_FILES_ERROR:
		case CREATE_CERTIFICATE_SUCCESS:
		case DELETE_CERTIFICATE_SUCCESS:
			return {
				...state,
				filterEnabled: false,
			};
		default:
			return state;
	}
}