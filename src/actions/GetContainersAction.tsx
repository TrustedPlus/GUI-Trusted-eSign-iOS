import { READ_CONTAINERS } from "../constants";
import { NativeModules, Alert } from "react-native";

export function getProviders() {
	return function action(dispatch) {
		NativeModules.Wrap_Main.getProviders(
			(err, verify) => {
				if (err) {
					Alert.alert(err + "");
				} else {
					NativeModules.Wrap_Main.getContainers(
						verify[0]["type"],
						verify[0]["name"],
						(err, containers) => {
							if (err) {
								Alert.alert(err + "");
							} else {
								dispatch({ type: READ_CONTAINERS, payload: containers });
							}
						});
				}
			});
	};
}