import { AnyAction } from "redux";
import { READ_REQUESTS, SELECTED_REQUEST } from "../constants";

const initialState = {
	arrRequests: [],
	lengthSelectedRequests: 0
};

function selectedRequest(oldArrRequests, key) {
	oldArrRequests[key].isSelected = !oldArrRequests[key].isSelected;
	return oldArrRequests;
}

function changedLength(oldLengthSelectedRequests, oldArrRequests, key) {
	if (oldArrRequests[key].isSelected) {
		oldLengthSelectedRequests++;
	} else {
		oldLengthSelectedRequests--;
	}
	return oldLengthSelectedRequests;
}

export function requests(state = initialState, action: AnyAction) {
	switch (action.type) {
		case READ_REQUESTS:
			return {
				...state,
				arrRequests: action.payload,
				lengthSelectedRequests: 0
			};
		case SELECTED_REQUEST:
			return {
				...state,
				arrRequests: selectedRequest(state.arrRequests.concat(), action.payload),
				lengthSelectedRequests: changedLength(state.lengthSelectedRequests, state.arrRequests.concat(), action.payload)
			};
		default:
			return state;
	}
}