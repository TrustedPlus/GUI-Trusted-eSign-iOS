import * as RNFS from "react-native-fs";
import { NativeModules, Alert } from "react-native";
import { readFiles } from "../actions/index";
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

export function signFile(files: IFile[], personalCert, footer, detached, toast) {
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
									toast("Файл был подписан");
								}
								if ((footer.arrButton.length > 1) && (lengthError === 0)) {
									toast("Файлы был подписаны");
								}
								if ((footer.arrButton.length === 1) && (lengthError === 1)) {
									toast("Ошибка при подписи файла");
								}
								if ((footer.arrButton.length > 1) && (lengthError === footer.arrButton.length)) {
									toast("Ошибка при подписи файлов");
								}
								if ((footer.arrButton.length > 1) && (lengthError !== footer.arrButton.length)) {
									toast("При подписи файлов некоторые файлы не были подписаны");
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
				const read = RNFS.read(path, 2, 0, "utf8");
				read.then(
					response => {
						NativeModules.Wrap_Signer.isDetachedSignMessage(
							path,
							"BASE64",
							(err, verify) => {
								if (err) {
									Alert.alert(err + "");
								} else {
									if (verify) {
										NativeModules.Wrap_Signer.verify(
											path.substring(0, path.length - 4),
											path,
											"BASE64",
											true,
											(err) => {
												if (err) {
													dispatch({ type: VERIFY_SIGN_ERROR, payload: err });
												} else {
													dispatch({ type: VERIFY_SIGN_SUCCESS, payload: files[footer.arrButton[i]].name });
												}
											});
									} else {
										NativeModules.Wrap_Signer.verify(
											"",
											path,
											"BASE64",
											false,
											(err) => {
												if (err) {
													dispatch({ type: VERIFY_SIGN_ERROR, payload: err });
												} else {
													dispatch({ type: VERIFY_SIGN_SUCCESS, payload: files[footer.arrButton[i]].name });
												}
											}
										);
									}
								}
							});
					},
					err => {
						NativeModules.Wrap_Signer.isDetachedSignMessage(
							path,
							"DER",
							(err, verify) => {
								if (err) {
									Alert.alert(err + "");
								} else {
									if (verify) {
										NativeModules.Wrap_Signer.verify(
											path.substring(0, path.length - 4),
											path,
											"DER",
											true,
											(err) => {
												if (err) {
													dispatch({ type: VERIFY_SIGN_ERROR, payload: err });
												} else {
													dispatch({ type: VERIFY_SIGN_SUCCESS, payload: files[footer.arrButton[i]].name });
												}
											});
									} else {
										NativeModules.Wrap_Signer.verify(
											"",
											path,
											"DER",
											false,
											(err) => {
												if (err) {
													dispatch({ type: VERIFY_SIGN_ERROR, payload: err });
												} else {
													dispatch({ type: VERIFY_SIGN_SUCCESS, payload: files[footer.arrButton[i]].name });
												}
											});
									}
								}
							});
					});
			}
			setTimeout(() => {
				dispatch({ type: VERIFY_SIGN_END });
			}, 400);
		}
	};
}