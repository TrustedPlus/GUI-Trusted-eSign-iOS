import * as RNFS from "react-native-fs";
import { NativeModules, Alert } from "react-native";
import { readFiles } from "../actions/index";
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

export function encAssymmetric(files: IFile[], otherCert, footer) {
	return function action(dispatch) {
		dispatch({ type: ENCODE_FILES });
		if (otherCert.title === "") {
			return dispatch({ type: ENCODE_FILES_END });
		} else {
			for (let i = 0; i < footer.arrButton.length; i++) {
				let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
				NativeModules.Wrap_Cipher.encrypt(
					[otherCert.serialNumber,
					otherCert.category],
					otherCert.provider,
					path,
					path + ".enc",
					"BASE64",
					(err) => {
						if (err) {
							Alert.alert(err);
							dispatch({ type: ENCODE_FILES_ERROR, payload: err });
						} else {
							// RNFS.copyFile(path + ".enc", "/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll + ".enc");
							dispatch({ type: ENCODE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name });
						}
					});
			}
			setTimeout(() => {
				dispatch(readFiles());
			}, 400);
		}
	};
}

export function decAssymmetric(files: IFile[], otherCert, footer) {
	return function action(dispatch) {
		dispatch({ type: DECODE_FILES });
		if (otherCert.title === "") {
			return dispatch({ type: DECODE_FILES_END });
		} else {
			for (let i = 0; i < footer.arrButton.length; i++) {
				let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
				let point = files[footer.arrButton[i]].extensionAll.lastIndexOf(".");
				let extension = files[footer.arrButton[i]].extensionAll.substring(0, point);
				const read = RNFS.read(path + "." + files[footer.arrButton[i]].extensionAll, 2, 0, "utf8");
				read.then(
					response => {
						NativeModules.Wrap_Cipher.decrypt(
							path + "." + files[footer.arrButton[i]].extensionAll,
							"BASE64",
							path + "." + extension,
							(err) => {
								if (err) {
									Alert.alert(err);
									dispatch({ type: DECODE_FILES_ERROR, payload: err });
								} else {
									// RNFS.copyFile(path + "." + extension, "/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + files[footer.arrButton[i]].name + "." + extension);
									dispatch({ type: DECODE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name });
								}
							});
					},
					err => {
						NativeModules.Wrap_Cipher.decrypt(
							path + "." + files[footer.arrButton[i]].extensionAll,
							"DER",
							path + "." + extension,
							(err) => {
								if (err) {
									Alert.alert(err);
									dispatch({ type: DECODE_FILES_ERROR, payload: err });
								} else {
									// RNFS.copyFile(path + "." + extension, "/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + files[footer.arrButton[i]].name + "." + extension);
									dispatch({ type: DECODE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name });
								}
							});
					});
			}
		}
		setTimeout(() => {
			dispatch(readFiles());
		}, 400);
	};
}