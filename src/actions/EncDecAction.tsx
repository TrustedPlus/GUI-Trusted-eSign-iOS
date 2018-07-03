import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";
import { readFiles } from "../actions/index";
import { showToast, showToastDanger } from "../utils/toast";
import {
	ENCODE_FILES, ENCODE_FILES_SUCCESS, ENCODE_FILES_ERROR, ENCODE_FILES_END,
	DECODE_FILES, DECODE_FILES_SUCCESS, DECODE_FILES_ERROR, DECODE_FILES_END
} from "../constants";

interface IFile {
	mtime: string;
	extension: string;
	extensionAll: string;
	name: string;
}

export function encAssymmetric(files: IFile[], otherCert, footer, signature, deleteAfter) {
	return function action(dispatch) {
		dispatch({ type: ENCODE_FILES });
		if (!otherCert.arrEncCertificates.length) {
			return dispatch({ type: ENCODE_FILES_END });
		} else {
			for (let i = 0; i < footer.arrButton.length; i++) {
				let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
				let selectedCertificates = [];
				otherCert.arrEncCertificates.map((cert) => {
					selectedCertificates.push(cert.serialNumber);
					selectedCertificates.push(cert.category);
				});
				NativeModules.Wrap_Cipher.encrypt(
					selectedCertificates,
					otherCert.arrEncCertificates[0].provider,
					path,
					path + ".enc",
					signature === "BASE-64" ? "BASE64" : "DER",
					(err) => {
						if (err) {
							showToastDanger(err);
							dispatch({ type: ENCODE_FILES_ERROR, payload: err });
						} else {
							// RNFS.copyFile(path + ".enc", "/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll + ".enc");
							dispatch({ type: ENCODE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name });
							if (deleteAfter) { RNFS.unlink(path); showToast("Файл успешно зашифрован\nИсходный файл был удален"); } else {
								showToast("Файл успешно зашифрован");
							}
						}
					});
			}
			setTimeout(() => {
				dispatch(readFiles());
			}, 400);
		}
	};
}

export function decAssymmetric(files: IFile[], footer) {
	return function action(dispatch) {
		dispatch({ type: DECODE_FILES });
		for (let i = 0; i < footer.arrButton.length; i++) {

			let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
			let point = files[footer.arrButton[i]].extensionAll.lastIndexOf(".");
			let extension = files[footer.arrButton[i]].extensionAll.substring(0, point);
			let encoding;
			const read = RNFS.read(path + "." + files[footer.arrButton[i]].extensionAll, 2, 0, "utf8");

			read.then(
				success => encoding = "BASE64",
				err => encoding = "DER"
			).then(
				() => NativeModules.Wrap_Cipher.decrypt(
					path + "." + files[footer.arrButton[i]].extensionAll,
					encoding,
					path + "." + extension,
					(err) => {
						if (err) {
							let index = err.indexOf("2146885620");
							if (index !== -1) {
								showToastDanger("Не найден закрытый ключ для расшифрования");
							} else {
								showToastDanger(err);
							}
							dispatch({ type: DECODE_FILES_ERROR, payload: err });
						} else {
							// RNFS.copyFile(path + "." + extension, "/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + files[footer.arrButton[i]].name + "." + extension);
							dispatch({ type: DECODE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name });
							showToast("Файл успешно расшифрован");
						}
					}
				)
			);
		}
		setTimeout(() => {
			dispatch(readFiles());
		}, 400);
	};
}