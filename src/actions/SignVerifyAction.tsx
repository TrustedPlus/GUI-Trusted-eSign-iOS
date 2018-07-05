import * as RNFS from "react-native-fs";
import { NativeModules, Alert } from "react-native";
import { readFiles } from "../actions/index";
import { showToast, showToastDanger } from "../utils/toast";
import {
	SIGN_FILE, SIGN_FILE_SUCCESS, SIGN_FILE_ERROR, SIGN_FILE_END,
	VERIFY_SIGN, VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, VERIFY_SIGN_END
} from "../constants";

interface IFile {
	mtime: string;
	extension: string;
	extensionAll: string;
	name: string;
}

export function signFile(files: IFile[], personalCert, footer, detached, signature) {
	return function action(dispatch) {
		let lengthError = 0;
		dispatch({ type: SIGN_FILE });
		for (let i = 0; i < footer.arrButton.length; i++) {
			let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
			if (files[footer.arrButton[i]].extension === "sig") {
				NativeModules.Wrap_Signer.coSign(
					personalCert.serialNumber,
					personalCert.category,
					personalCert.provider,
					path,
					path,
					signature === "BASE-64" ? "BASE64" : "DER",
					false,
					(err) => {
						if (err) {
							lengthError++;
							dispatch({ type: SIGN_FILE_ERROR, payload: err });
						} else {
							setTimeout(() => {
								dispatch(readFiles());
								if ((footer.arrButton.length === 1) && (lengthError === 0)) {
									showToast("Подпись была добавлена");
								}
								if ((footer.arrButton.length > 1) && (lengthError === footer.arrButton.length)) {
									showToast("Ошибка при добавлении подписи");
								}
								if ((footer.arrButton.length > 1) && (lengthError > 0)) {
									showToast("Для некоторых файлов подпись не смогла быть добавлена");
								}
							}, 300);
							dispatch({ type: SIGN_FILE_SUCCESS, payload: files[footer.arrButton[i]].name });
						}
					}
				);
			} else {
				NativeModules.Wrap_Signer.sign(
					personalCert.serialNumber,
					personalCert.category,
					personalCert.provider,
					path,
					path + ".sig",
					signature === "BASE-64" ? "BASE64" : "DER",
					detached,
					(err) => {
						if (err) {
							lengthError++;
							dispatch({ type: SIGN_FILE_ERROR, payload: err });
						} else {
							/*RNFS.copyFile(path + ".sig", "/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll + ".sig").then(
								success => {
									console.log(success);
								},
								err => {
									console.log(err.message);
									RNFS.unlink("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll + ".sig")
									.then(() => {
										RNFS.copyFile(path + ".sig", "/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll + ".sig");
									})
									.catch((err) => {
										console.log(err.message);
									});
								}
							); */
							setTimeout(() => {
								dispatch(readFiles());
								if ((footer.arrButton.length === 1) && (lengthError === 0)) {
									showToast("Файл был подписан");
								}
								if ((footer.arrButton.length > 1) && (lengthError === 0)) {
									showToast("Файлы был подписаны");
								}
								if ((footer.arrButton.length === 1) && (lengthError === 1)) {
									showToast("Ошибка при подписи файла");
								}
								if ((footer.arrButton.length > 1) && (lengthError === footer.arrButton.length)) {
									showToast("Ошибка при подписи файлов");
								}
								if ((footer.arrButton.length > 1) && (lengthError > 0)) {
									showToast("При подписи некоторые файлы не были подписаны");
								}
							}, 300);
							dispatch({ type: SIGN_FILE_SUCCESS, payload: files[footer.arrButton[i]].name });
						}
					}
				);
			}
		}
	};
}

export function verifySign(files: IFile[], footer) {
	return function action(dispatch) {
		dispatch({ type: VERIFY_SIGN });
		for (let i = 0; i < footer.arrButton.length; i++) {
			let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
			let encoding;
			const read = RNFS.read(path, 2, 0, "utf8");

			read.then(
				success => encoding = "BASE64",
				err => encoding = "DER"
			).then(
				() => NativeModules.Wrap_Signer.isDetachedSignMessage(
					path,
					encoding,
					(err, verify) => {
						if (err) {
							showToastDanger(err);
						} else {
							NativeModules.Wrap_Signer.verify(
								verify ? path.substring(0, path.length - 4) : "",
								path,
								encoding,
								verify ? true : false,
								(err) => {
									if (err) {
										if (err.indexOf("readFile Cannot open input file.") !== -1) {
											showToastDanger("Отделенная подпись. Для проверки необходимо переместить исходный файл в Документы");
										} else if (err.indexOf("For one of the signed certificates, the chain could not be established.") !== -1) {
											showToastDanger("Для одного из сертификатов, подписавших файл, цепочка не может быть построена");
										} else {
											showToastDanger(err);
										}
										dispatch({ type: VERIFY_SIGN_ERROR, payload: files[footer.arrButton[i]].name });
									} else {
										showToast("Подпись достоверна");
										dispatch({ type: VERIFY_SIGN_SUCCESS, payload: files[footer.arrButton[i]].name });
									}
								}
							);
						}
					}
				)
			);
			setTimeout(() => dispatch({ type: VERIFY_SIGN_END }), 400);
		}
	};
}

export function UnSignFile(files: IFile[], footer) {
	return function action(dispatch) {
		for (let i = 0; i < footer.arrButton.length; i++) {
			let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
			let encoding;
			const read = RNFS.read(path, 2, 0, "utf8");

			read.then(
				success => encoding = "BASE64",
				err => encoding = "DER"
			).then(
				() => NativeModules.Wrap_Signer.unSign(
					path,
					encoding,
					path.substr(0, path.length - 4),
					(err) => {
						if (err) {
							showToastDanger("Открепленная подпись. При снятии подписи произошла ошибка.");
						} else {
							RNFS.unlink(path);
							dispatch(readFiles());
							showToast("Подпись была успешно снята");
						}
					}
				)
			);
		}
	};
}

export function getSignInfo(files: IFile[], footer, navigate) {
	return function action(dispatch) {
		for (let i = 0; i < footer.arrButton.length; i++) {
			let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
			let encoding;
			const read = RNFS.read(path, 2, 0, "utf8");

			read.then(
				success => encoding = "BASE64",
				err => encoding = "DER"
			).then(
				() => NativeModules.Wrap_Signer.isDetachedSignMessage(
					path,
					encoding,
					(err, verify) => {
						if (err) {
							showToastDanger(err);
						} else {
							NativeModules.Wrap_Signer.getSignInfo(
								verify ? path.substring(0, path.length - 4) : "",
								path,
								encoding,
								verify ? true : false,
								(err, verify) => {
									if (err) {
										showToastDanger(err);
									} else {
										navigate("AboutSignCert", verify);
									}
								}
							);
						}
					}
				)
			);
		}
	};
}