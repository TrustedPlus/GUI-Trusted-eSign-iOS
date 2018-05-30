import { READ_CERT_KEY, READ_CERTIFICATES_SUCCESS } from "../constants";

const initialState = {
	certificates: [],
};

export function certificates(state = initialState, action) {
	switch (action.type) {
		case READ_CERT_KEY:
			return {
				...state
			};
		case READ_CERTIFICATES_SUCCESS:
			return {
				...state,
				certificates: action.payload
			};
		default:
			return state;
	}
}