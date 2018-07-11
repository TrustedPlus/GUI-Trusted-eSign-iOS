import { READ_CONTAINERS, ADD_PROVIDERS } from "../constants";

const initialState = {
	containers: [],
	providers: []
};

export function containers(state = initialState, action) {
	switch (action.type) {
		case READ_CONTAINERS:
			return {
				...state,
				containers: action.payload
			};
		case ADD_PROVIDERS:
			return {
				...state,
				providers: action.payload
			};
		default:
			return state;
	}
}