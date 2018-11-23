import { READ_CONTAINERS, ADD_PROVIDERS } from "../constants";

const initialState = {
	containers: [],
	providers: [],
	loader: false
};

export function containers(state = initialState, action) {
	switch (action.type) {
		case READ_CONTAINERS:
			return {
				...state,
				containers: action.payload,
				loader: false
			};
		case ADD_PROVIDERS:
			return {
				...state,
				providers: action.payload,
				loader: true
			};
		default:
			return state;
	}
}