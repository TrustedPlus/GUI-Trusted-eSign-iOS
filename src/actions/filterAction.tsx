import { CHANGE_FILTER } from "../constants";

export function changeFilter(filterSetting) {
	return function action(dispatch) {
		dispatch({ type: CHANGE_FILTER, payload: filterSetting });
	};
}
