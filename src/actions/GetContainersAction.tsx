import { READ_CONTAINERS, ADD_PROVIDERS } from "../constants";
import { NativeModules } from "react-native";
import { showToastDanger } from "../utils/toast";

export function getProviders() {
	return function action(dispatch) {
		NativeModules.Wrap_Main.getProviders(
			(err, verify) => {
				if (err) {
					showToastDanger(err);
				} else {
					dispatch({type: ADD_PROVIDERS, payload: verify});
					NativeModules.Wrap_Main.getContainers(
						verify[1]["type"],
						verify[1]["name"],
						(err, containers) => {
							if (err) {
								showToastDanger(err);
							} else {
								dispatch({ type: READ_CONTAINERS, payload: containers });
							}
						});
				}
			});
	};
}