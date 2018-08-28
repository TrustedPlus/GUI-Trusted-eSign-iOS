import { REFRESH_STATUS_LICENSE } from "../constants";

const initialState = {
	status: 0
};

export function statusLicense(state = initialState, action) {
	switch (action.type) {
		case REFRESH_STATUS_LICENSE:
			return {
				...state,
				status: action.payload,
			};
		default:
			return state;
	}
}