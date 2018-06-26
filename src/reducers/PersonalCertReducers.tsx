import { PERSONAL_CERT_ACTION, PERSONAL_CERT_CLEAR, SIGN_CERT_CLEAR_CERT } from "../constants";

const initialState = {
	title: null,
	img: null,
	note: null,
	issuerName: null,
	serialNumber: null,
	provider: null,
	category: null,
	hasPrivateKey: null
};

export function personalCert(state = initialState, action) {
	switch (action.type) {
		case PERSONAL_CERT_ACTION:
			return {
				...state,
				title: action.payload[0],
				img: action.payload[1],
				note: action.payload[2],
				issuerName: action.payload[3],
				serialNumber: action.payload[4],
				provider: action.payload[5],
				category: action.payload[6],
				hasPrivateKey: action.payload[7]
			};
		case SIGN_CERT_CLEAR_CERT: {
			if ((state.issuerName === action.payload.issuerName) && (state.category === action.payload.category)) {
				return {
					...state,
					title: null,
					img: null,
					note: null,
					issuerName: null,
					serialNumber: null,
					provider: null,
					category: null,
					hasPrivateKey: null
				};
			}
			return {
				...state
			};
		}
		case PERSONAL_CERT_CLEAR:
			return {
				...state,
				title: null,
				img: null,
				note: null,
				issuerName: null,
				serialNumber: null,
				provider: null,
				category: null,
				hasPrivateKey: null
			};
		default:
			return state;
	}
}