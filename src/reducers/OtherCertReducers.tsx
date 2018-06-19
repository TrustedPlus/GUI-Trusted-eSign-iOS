import { OTHER_CERT_ACTION, OTHER_CERT_CLEAR, OTHER_CERT_CLEAR_CERT } from "../constants";

const initialState = {
	arrEncCertificates: []
};

export function otherCert(state = initialState, action) {
	switch (action.type) {
		case OTHER_CERT_ACTION:
			return {
				...state,
				arrEncCertificates: action.payload
			};
		case OTHER_CERT_CLEAR:
			return {
				...state,
				arrEncCertificates: [],
				arrNumEncCertificates: []
			};
		case OTHER_CERT_CLEAR_CERT:
			let oldArrEncCertificates = state.arrEncCertificates;
			let index = oldArrEncCertificates.indexOf(action.payload);
			if (index !== -1) {
				oldArrEncCertificates.splice(index, 1); // удаление из массива
			}
			return {
				...state,
				arrEncCertificates: oldArrEncCertificates
			};
		default:
			return state;
	}
}