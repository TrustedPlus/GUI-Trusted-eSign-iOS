import { READ_CONTAINERS } from "../constants";

const initialState = {
	containers: []
};

export function containers(state = initialState, action) {
	switch (action.type) {
		case READ_CONTAINERS:
			return {
				...state,
				containers: action.payload
			};
		default:
			return state;
	}
}