import { AnyAction } from "redux";
import { READ_REQUESTS } from "../constants";

const initialState = {
	arrRequests: []
};

export function requests(state = initialState, action: AnyAction) {
	switch (action.type) {
		case READ_REQUESTS:
			return {
				...state,
				arrRequests: action.payload,
			};
		default:
			return state;
	}
}