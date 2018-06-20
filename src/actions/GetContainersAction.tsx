import { READ_CONTAINERS } from "../constants";
import { NativeModules } from "react-native";
import { showToast } from "../utils/toast";

export function getProviders() {
	return function action(dispatch) {
		NativeModules.Wrap_Main.getProviders(
			(err, verify) => {
				if (err) {
					showToast(err);
				} else {
					NativeModules.Wrap_Main.getContainers(
						verify[0]["type"],
						verify[0]["name"],
						(err, containers) => {
							if (err) {
								showToast(err);
							} else {
								dispatch({ type: READ_CONTAINERS, payload: containers });
							}
						});
				}
			});
	};
}