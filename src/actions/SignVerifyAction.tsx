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

export function signFile(files: IFile[], personalCert, footer, detached) {
	return function action(dispatch) {
		let lengthError = 0;
		dispatch({ type: SIGN_FILE });
		if (personalCert.title === "") {
			dispatch({ type: SIGN_FILE_END });
		} else {
			for (let i = 0; i < footer.arrButton.length; i++) {
				let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
				NativeModules.Wrap_Signer.sign(
					personalCert.serialNumber,
					personalCert.category,
					personalCert.provider,
					path,
					path + ".sig",
					"BASE64",
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
									showToast("При подписи файлов некоторые файлы не были подписаны");
								}
							}, 300);
							dispatch({ type: SIGN_FILE_SUCCESS, payload: files[footer.arrButton[i]].name });
						}
					});
			}
		}
	};
}

export function verifySign(files: IFile[], personalCert, footer) {
	return function action(dispatch) {
		dispatch({ type: VERIFY_SIGN });
		if (personalCert.title === "") {
			dispatch({ type: VERIFY_SIGN_END });
		} else {
			for (let i = 0; i < footer.arrButton.length; i++) {
				let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
				let encoding;
				const read = RNFS.read(path, 2, 0, "utf8");

				read.then(
					response => encoding = "BASE64",
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
											showToastDanger(err);
											dispatch({ type: VERIFY_SIGN_ERROR, payload: files[footer.arrButton[i]].name });
										} else {
											dispatch({ type: VERIFY_SIGN_SUCCESS, payload: files[footer.arrButton[i]].name });
										}
									}
								);
							}
						}
					)
				);
			}
			setTimeout(() => {
				dispatch({ type: VERIFY_SIGN_END });
			}, 400);
		}
	};
}