import { PERSONAL_CERT_ACTION, PERSONAL_CERT_CLEAR, SIGN_CERT_CLEAR_CERT } from "../constants";

const initialState = {
	cert: {
		category: null,
		chainBuilding: null,
		hasPrivateKey: null,
		isCA: null,
		issuerFriendlyName: null,
		issuerName: null,
		keyUsage: null,
		notAfter: null,
		notBefore: null,
		organizationName: null,
		provider: null,
		publicKeyAlgorithm: null,
		selfSigned: null,
		serialNumber: null,
		signatureAlgorithm: null,
		signatureDigestAlgorithm: null,
		subjectFriendlyName: null,
		subjectName: null,
		type: null,
		version: null
	},
	img: null
};

export function personalCert(state = initialState, action) {
	switch (action.type) {
		case PERSONAL_CERT_ACTION:
			return {
				...state,
				cert: action.payload.cert,
				img: action.payload.img
			};
		case SIGN_CERT_CLEAR_CERT: {
			if ((state.cert.issuerName === action.payload.issuerName) && (state.cert.category === action.payload.category)) {
				return {
					...state,
					cert: null,
					img: null
				};
			}
			return {
				...state
			};
		}
		case PERSONAL_CERT_CLEAR:
			return {
				...state,
				cert: null,
				img: null
			};
		default:
			return state;
	}
}