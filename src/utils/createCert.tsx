import { Alert, AlertIOS, NativeModules } from "react-native";
import * as RNFS from "react-native-fs";

function randomRowGeneration(length) {
	let text = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

export function genSelfSignedCertWithoutRequest(algorithm, keyAssignment, certAssignment: boolean[], CN, email, org, city, obl, country) {
	return new Promise((resolve, reject) => {
		NativeModules.Wrap_CertRequest.genSelfSignedCertWithoutRequest(
			algorithm,
			randomRowGeneration(8) + "-" + randomRowGeneration(4) + "-" + randomRowGeneration(4) + "-" + randomRowGeneration(4) + "-" + randomRowGeneration(12),
			keyAssignment,
			certAssignment,
			true, CN, email, org, city, obl, country,
			RNFS.DocumentDirectoryPath + "/Files/" + CN + ".cer",
			(err, verify) => {
				if (!!verify) {
					resolve(verify);
				}
				if (err) {
					reject(err);
				}
			});
	});
}