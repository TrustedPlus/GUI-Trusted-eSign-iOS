import RNFetchBlob from "rn-fetch-blob";
import * as RNFS from "react-native-fs";
import { showToast, showToastDanger } from "../utils/toast";
import { NativeModules } from "react-native";
import * as url from "url";

export function takeUrl(url_string, addTempFilesForCryptoarmdDocuments, addFiles, navigate, clearAllFilesinWorkspaceSign, refreshFunc ) {
	refreshFunc(true);
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
									refreshFunc(false);
								} else {
									NativeModules.Wrap_Signer.getSignInfo(
										"",
										res.path(),
										encoding,
										false,
										(err, verify) => {
											refreshFunc(false);
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
			let filename, extension, footerMark, promises = [], arrExtension = [];
			for (let i = 0; i < arrId.length; i++) {
				promises.push(
					new Promise((resolve, reject) => {
						RNFetchBlob
							.config({
								fileCache: true
							})
							.fetch("POST", param.url + "&id=" + arrId[i]) // url=https://license.trusted.ru:443/bitrix/components/trusted/docs/ajax.php?command=content&id=5
							.then((res) => {
								// the path should be dirs.DocumentDir + 'path-to-file.anything'
								RNFS.stat(res.path()).then(
									response => {
										filename = decodeURI(arrNameFiles[i]);
										extension = filename.substring(filename.lastIndexOf(".") + 1);
										arrExtension.push(extension);
										arrFilesNameAndId[i] = ({
											id: arrId[i],
											realname: res.info().taskId,
											verify: 0,
											filename,
											extension,
											stat: response
										});
										resolve();
									}
								);
							});
					}));
				// footerMark:
				// 1) одиночный простой файл, множество разных файлов - только подпись
				// 2) множество подписаных файлов - подпись и проверка
				// 3) одиночный подписаный файл - все функции
				// 4) неподписанные файлы - доступна функция выбора кодировки
				// addFilesInWorkspaceSign(files, selectedFiles); navigate("Signature", { selectedFiles: { arrNum: selectedFilesForSign, arrExtension: selectedFiles.arrExtension } });
			}
			Promise.all(promises)
				.then(
					() => {
						if (arrExtension.length === arrExtension.filter(extension => extension === "sig").length) {
							if (arrExtension.length === 1) {
								footerMark = 3;
							} else {
								footerMark = 2;
							}
						} else {
							if (arrExtension.length === arrExtension.filter(extension => extension !== "sig").length) {
								footerMark = 4;
							} else {
								footerMark = 1;
							}
						}
						addTempFilesForCryptoarmdDocuments(arrFilesNameAndId, param.uploadurl, chrome, param.href, param.extra, footerMark);
						refreshFunc(false);
						navigate("SignForCryptoArmDoc");
					}
				);
			break;
		default: break;
	}
}