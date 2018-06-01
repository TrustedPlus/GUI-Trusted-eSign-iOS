import { DELETE_CERTIFICATE_SUCCESS, DELETE_CERTIFICATE_ERROR } from "../constants";
import { NativeModules, Alert, AlertIOS } from "react-native";
import { readCertKeys } from "./CertKeysAction";
import { getProviders } from "./getContainersAction";

export function deleteCertAction(cert, withContainers, goBack) {
	return function action(dispatch) {
		NativeModules.Wrap_Cert.deleteCertInStore(
			cert.serialNumber,
			cert.category,
			cert.provider,
			withContainers,
			(err, deleteCert) => {
				if (err) {
					dispatch({ type: DELETE_CERTIFICATE_ERROR, payload: cert.subjectFriendlyName });
					Alert.alert("err: " + err);
				} else {
					dispatch({ type: DELETE_CERTIFICATE_SUCCESS, payload: cert.subjectFriendlyName });
					dispatch(readCertKeys());
					dispatch(getProviders());
					() => goBack();
					AlertIOS.alert(
						"Сертификат был успешно удален",
						null,
						[
							{ text: "Ок", onPress: () => null },
						]
					);
				}
			});
	};
}