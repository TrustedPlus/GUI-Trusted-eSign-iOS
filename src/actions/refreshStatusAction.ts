import { REFRESH_STATUS_LICENSE } from "../constants";
import { NativeModules } from "react-native";

export function refreshStatusLicense() {
	return function action(dispatch) {
		let errAppLicense = -1;
		let errCSPLicense = -1;
		NativeModules.Wrap_License.getValidityTimeOfLicense(
			(err, label) => {
				if (!err) {
					errAppLicense = 1;
				} else {
					errAppLicense = 0;
				}
				NativeModules.Wrap_License.CSPLicenseCheck(
					(err, label) => {
						if (!err) {
							errCSPLicense = label;
						} else {
							errCSPLicense = label;
						}
						if (errAppLicense === 1 && errCSPLicense === 1) {
							dispatch({ type: REFRESH_STATUS_LICENSE, payload: 1 });
						} else {
							dispatch({ type: REFRESH_STATUS_LICENSE, payload: 0 });
						}
					});
			});
	};
}
