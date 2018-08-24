import { AnyAction } from "redux";
import { READ_REQUESTS, SELECTED_REQUEST, CLEAR_REQUESTS } from "../constants";

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
			/*function compareAge(file1, file2) {
				if (file1.time < file2.time) { return 1; }
				if (file1.time > file2.time) { return -1; }
			}

			action.payload.sort(compareAge);*/
			return {
				...state,
				arrRequests: action.payload
			};
		case SELECTED_REQUEST:
			return {
				...state,
				arrRequests: selectedRequest(state.arrRequests.concat(), action.payload),
				lengthSelectedRequests: changedLength(state.lengthSelectedRequests, state.arrRequests.concat(), action.payload)
			};
		case CLEAR_REQUESTS:
			return {
				...state,
				arrRequests: [],
				lengthSelectedRequests: 0
			};
		default:
			return state;
	}
}