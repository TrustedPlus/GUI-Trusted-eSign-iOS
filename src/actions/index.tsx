import {
	FOOTER_ACTION, FOOTER_CLOSE, PERSONAL_CERT_ACTION, OTHER_CERT_ACTION, CLEAR_LOG,
	READ_FILES, READ_FILES_SUCCESS, READ_FILES_ERROR,
	ADD_FILES, ADD_FILES_SUCCESS, ADD_FILES_ERROR, CLEAR_FILES,
	ADD_CERT_OR_KEY, ADD_CERT_SUCCESS, ADD_CERT_ERROR, ADD_KEY_SUCCESS, ADD_KEY_ERROR,
	PERSONAL_CERT_CLEAR, OTHER_CERT_CLEAR,
} from "../constants";
import * as RNFS from "react-native-fs";
import { NativeModules, Alert } from "react-native";
import { readCertKeys } from "./CertKeysAction";
import { getProviders } from "./getContainersAction";

export function footerAction(idButton, extension) {
	return {
		type: FOOTER_ACTION,
		payload: { idButton, extension }
	};
}

export function footerClose() {
	return {
		type: FOOTER_CLOSE
	};
}

export function addCertForSign(title, img, note, issuerName, serialNumber, provider, category, hasPrivateKey) {
	return {
		type: PERSONAL_CERT_ACTION,
		payload: [title, img, note, issuerName, serialNumber, provider, category, hasPrivateKey]
	};
}

export function addCertForEnc(title, img, note, issuerName, serialNumber, provider, category, hasPrivateKey) {
	return {
		type: OTHER_CERT_ACTION,
		payload: [title, img, note, issuerName, serialNumber, provider, category, hasPrivateKey]
	};
}

export function personalCertClear() {
	return {
		type: PERSONAL_CERT_CLEAR
	};
}

export function otherCertClear() {
	return {
		type: OTHER_CERT_CLEAR
	};
}

export function clearFiles() {
	return {
		type: CLEAR_FILES
	};
}

export function readFiles() {
	return function action(dispatch) {
		dispatch({ type: READ_FILES });
		RNFS.mkdir(RNFS.DocumentDirectoryPath + "/Files").then(
			response => {
				const request = RNFS.readDir(RNFS.DocumentDirectoryPath + "/Files"); // "/cprocsp/users/stores"
				return request.then(
					response => {
						dispatch(clearFiles());
						dispatch(footerClose());
						dispatch(readFilesSuccess(response));
					},
					err => dispatch({ type: READ_FILES_ERROR })
				);
			},
			err => { null; }
		);
	};
}

export function readFilesSuccess(file) {
	return function action(dispatch) {
		let filearr = [], point, name, extensionAll, extension, date, month, year, time, verify = 0;
		let length = file.length;
		let k = 0;
		for (let i = 0; i < length; i++) {
			point = file[i].name.indexOf(".");
			name = file[i].name.substring(0, point);
			extensionAll = file[i].name.substring(point + 1);
			point = extensionAll.lastIndexOf(".");
			extension = extensionAll.substring(point + 1);
			date = file[i].mtime.getDate();
			month = file[i].mtime.getMonth();
			switch (month) {
				case 0: month = "января"; break;
				case 1: month = "февраля"; break;
				case 2: month = "марта"; break;
				case 3: month = "апреля"; break;
				case 4: month = "мая"; break;
				case 5: month = "июня"; break;
				case 6: month = "июля"; break;
				case 7: month = "августа"; break;
				case 8: month = "сентября"; break;
				case 9: month = "октября"; break;
				case 10: month = "ноября"; break;
				case 11: month = "декабря"; break;
				default: break;
			}
			year = file[i].mtime.getFullYear();
			time = file[i].mtime.toLocaleTimeString();
			if (name === "") {
				// k++;
				name = extension;
				extension = 0;
				filearr[i - k] = { name, extension, extensionAll, date, month, year, time, verify };
			} else {
				filearr[i - k] = { name, extension, extensionAll, date, month, year, time, verify };
			}
		}
		dispatch({ type: READ_FILES_SUCCESS, payload: filearr });
	};
}

export function clearLog() {
	return {
		type: CLEAR_LOG
	};
}

export function addFiles(uri, fileName) {
	return function action(dispatch) {
		dispatch({ type: ADD_FILES });
		let point, name;
		point = fileName.indexOf(".");
		name = fileName.substring(0, point);
		const copyFile = RNFS.copyFile(decodeURIComponent(uri.replace("file:///", "/")), RNFS.DocumentDirectoryPath + "/Files/" + fileName);
		return copyFile.then(
			response => {
				dispatch({ type: ADD_FILES_SUCCESS, payload: name });
				dispatch(readFiles());
			},
			err => {
				dispatch({ type: ADD_FILES_ERROR, payload: name });
				Alert.alert("Ошибка при добавлении файла");
			}
		);
	};
}

export function addCert(uri, fileName?, password?, fn?) {
	return function action(dispatch) {
		dispatch({ type: ADD_CERT_OR_KEY });
		let point, name, extension;
		point = fileName.indexOf(".");
		name = fileName.substring(0, point);
		extension = fileName.substring(point + 1);
		switch (extension) {
			case "pfx": {
				let certPath = decodeURIComponent(uri.replace("file:///", "/"));
				NativeModules.Wrap_Pkcs12.importPFX(
					certPath,
					password,
					"",
					(err, imp) => {
						if (err) {
							fn(err);
							dispatch({ type: ADD_CERT_ERROR, payload: err });
						} else {
							dispatch({ type: ADD_CERT_SUCCESS, payload: name });
							setTimeout(() => {
								Alert.alert("Сертификат успешно добавлен");
								dispatch(getProviders());
								dispatch(readCertKeys());
							}, 400);
						}
					});
				break;
			}
			case "cer":
			case "crt": {
				let certPath = decodeURIComponent(uri.replace("file:///", "/"));
				return RNFS.read(certPath, 2, 0).then(
					response => {
						NativeModules.Wrap_Cert.saveCertToStore(
							certPath,
							response === "--" ? "BASE64" : "DER",
							"OTHERS",
							(err, saveCert) => {
								if (err) {
									dispatch({ type: ADD_CERT_ERROR, payload: err });
									Alert.alert("Ошибка при добавлении сертификата");
								} else {
									dispatch({ type: ADD_CERT_SUCCESS, payload: name });
									Alert.alert("Сертификат успешно добавлен");
									dispatch(readCertKeys());
								}
							});
					},
					err => {
						return RNFS.read(certPath, 2, 0, "base64").then(
							response => {
								NativeModules.Wrap_Cert.saveCertToStore(
									certPath,
									response === "--" ? "BASE64" : "DER",
									"OTHERS",
									(err, saveCert) => {
										if (err) {
											dispatch({ type: ADD_CERT_ERROR, payload: err });
											Alert.alert("Ошибка при добавлении сертификата");
										} else {
											dispatch({ type: ADD_CERT_SUCCESS, payload: name });
											Alert.alert("Сертификат успешно добавлен");
											dispatch(readCertKeys());
										}
									});
							},
							err => { dispatch({ type: ADD_CERT_ERROR, payload: name }); Alert.alert(err + ""); }
						);
					}
				);
			}
			case "key": {
				let certPath = decodeURIComponent(uri.replace("file:///", "/"));
				NativeModules.Wrap_Cert.saveKeyToStore(
					certPath,
					"BASE64",
					"",
					(err, saveKey) => {
						if (err) {
							dispatch({ type: ADD_KEY_ERROR, payload: err });
							Alert.alert("Ошибка при добавлении ключа");
						} else {
							dispatch({ type: ADD_KEY_SUCCESS, payload: name });
							dispatch(readCertKeys());
						}
					});
				break;
			}
			default: {
				Alert.alert("Неподдерживаемое расширение сертификата");
				break;
			}
		}
	};
}