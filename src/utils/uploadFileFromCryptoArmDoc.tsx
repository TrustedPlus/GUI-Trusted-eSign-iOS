import RNFetchBlob from "rn-fetch-blob";
import * as RNFS from "react-native-fs";
import { showToast, showToastDanger } from "../utils/toast";
import { NativeModules } from "react-native";
import * as url from "url";

export function takeUrl(url_string, addTempFilesForCryptoarmdDocuments, addFiles, navigate, clearAllFilesinWorkspaceSign) {
	let param = url.parse(url_string, true);
	let chrome = param.query.browser;
	clearAllFilesinWorkspaceSign();
	switch (param.hostname) {
		case "verify":
			RNFetchBlob
				.config({
					fileCache: true
				})
				.fetch("POST", param.query.url + "&id=" + param.query.id)
				.then((res) => {
					// the path should be dirs.DocumentDir + 'path-to-file.anything'
					console.log("The file saved to ", res.path());

					let encoding;
					const read = RNFS.read(res.path(), 2, 0, "utf8");
					read.then(
						success => encoding = "BASE64",
						err => encoding = "DER"
					).then(
						() => NativeModules.Wrap_Signer.isDetachedSignMessage(
							res.path(),
							encoding,
							(err, isDetached) => {
								if (isDetached || err) {
									if (err) {
										debugger;
										showToastDanger(err);
									} else {
										showToastDanger("подпись отделенная");
									}
								} else {
									NativeModules.Wrap_Signer.getSignInfo(
										"",
										res.path(),
										encoding,
										false,
										(err, verify) => {
											if (err) {
												debugger;
												showToastDanger(err);
											} else {
												if (verify.length === 1) {
													navigate("AboutSignCert", { cert: verify[0], isCryptoDoc: true });
												} else {
													navigate("AboutAllSignCert", { cert: verify, isCryptoDoc: true });
												}
											}
										}
									);
								}
							}
						)
					);

				});
			//
			break;
		case "sign":
			param = param.query;
			let arrId = param.ids.split(",");
			let arrNameFiles = param.filename.split(",");
			let arrFilesNameAndId = [];
			for (let i = 0; i < arrId.length; i++) {
				RNFetchBlob
					.config({
						fileCache: true
					})
					.fetch("POST", param.url + "&id=" + arrId[i]) // url=https://license.trusted.ru:443/bitrix/components/trusted/docs/ajax.php?command=content&id=5
					.then((res) => {
						// the path should be dirs.DocumentDir + 'path-to-file.anything'
						arrFilesNameAndId[i] = ({
							id: arrId[i],
							realname: res.info().taskId,
							filename: decodeURI(arrNameFiles[i])
						});
						debugger;
						console.log("The file saved to ", res.path());
						if (i === arrId.length - 1) {
							addTempFilesForCryptoarmdDocuments(arrFilesNameAndId, param.uploadurl, chrome, param.href, param.extra);
							navigate("SignForCryptoArmDoc");
						}
					});
				// addFilesInWorkspaceSign(files, selectedFiles); navigate("Signature", { selectedFiles: { arrNum: selectedFilesForSign, arrExtension: selectedFiles.arrExtension } });

			}
			break;
		default: break;
	}
}