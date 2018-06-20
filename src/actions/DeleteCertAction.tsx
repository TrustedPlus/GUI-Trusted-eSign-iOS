import { DELETE_CERTIFICATE_SUCCESS, DELETE_CERTIFICATE_ERROR } from "../constants";
import { NativeModules, Alert, AlertIOS } from "react-native";
import { readCertKeys } from "./certKeysAction";
import { getProviders } from "./getContainersAction";
import { deleteCertInArrEncCertificates } from "./index";
import { showToast } from "../utils/toast";

export function deleteCertAction(cert, withContainers, key, goBack) {
	return function action(dispatch) {
		NativeModules.Wrap_Cert.deleteCertInStore(
			cert.serialNumber,
			cert.category,
			cert.provider,
			withContainers,
			(err, deleteCert) => {
				if (err) {
					dispatch({ type: DELETE_CERTIFICATE_ERROR, payload: cert.subjectFriendlyName });
					showToast(err);
				} else {
					dispatch({ type: DELETE_CERTIFICATE_SUCCESS, payload: cert.subjectFriendlyName });
					dispatch(readCertKeys());
					dispatch(getProviders());
					dispatch(deleteCertInArrEncCertificates(cert));
					() => goBack();
					showToast("Сертификат был успешно удален");
				}
			});
	};
}