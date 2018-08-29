import {
	/*FOOTER_ACTION, FOOTER_CLOSE, */PERSONAL_CERT_ACTION, OTHER_CERT_ACTION, CLEAR_LOG,
	READ_FILES, READ_FILES_SUCCESS, READ_FILES_ERROR,
	ADD_FILES, ADD_FILES_SUCCESS, ADD_FILES_ERROR, CLEAR_FILES,
	ADD_CERT_OR_KEY, ADD_CERT_SUCCESS, ADD_CERT_ERROR, ADD_KEY_SUCCESS, ADD_KEY_ERROR,
	PERSONAL_CERT_CLEAR, OTHER_CERT_CLEAR, ENC_CERT_CLEAR_CERT, SIGN_CERT_CLEAR_CERT
} from "../constants";
import * as RNFS from "react-native-fs";
import { showToast } from "../utils/toast";
import { NativeModules } from "react-native";
import { readCertKeys } from "./certKeysAction";
import { getProviders } from "./getContainersAction";
import { addSingleFileInWorkspaceSign, addSingleFileInWorkspaceEnc } from "./workspaceAction";
/*
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
} */

export function addCertForSign(title, img, note, issuerName, serialNumber, provider, category, hasPrivateKey) {
	return {
		type: PERSONAL_CERT_ACTION,
		payload: [title, img, note, issuerName, serialNumber, provider, category, hasPrivateKey]
	};
}

export function addCertForEnc(certForEnc) {
	return {
		type: OTHER_CERT_ACTION,
		payload: certForEnc
	};
}

export function deleteCertInArrEncCertificates(cert) {
	return {
		type: ENC_CERT_CLEAR_CERT,
		payload: cert
	};
}

export function deleteCertInSignCertificates(cert) {
	return {
		type: SIGN_CERT_CLEAR_CERT,
		payload: cert
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
				filearr[i] = { name, extension, extensionAll, date, month, year, time, verify };
			} else {
				filearr[i] = { name, extension, extensionAll, date, month, year, time, verify };
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

export function addFiles(uri, fileName, workspace, refreshDoc) {
	return function action(dispatch) {
		dispatch({ type: ADD_FILES });
		let point, name;
		point = fileName.indexOf(".");
		name = fileName.substring(0, point);
		const copyFile = RNFS.copyFile(decodeURIComponent(uri.replace("file:///", "/")), RNFS.DocumentDirectoryPath + "/Files/" + fileName);
		return copyFile.then(
			response => {
				dispatch({ type: ADD_FILES_SUCCESS, payload: fileName });
				if (workspace) {
					const request = RNFS.stat(RNFS.DocumentDirectoryPath + "/Files/" + fileName);
					request.then(
						response => {
							const verify = 0;
							let filearr;
							let point = fileName.indexOf(".");
							const name = fileName.substring(0, point);
							const extensionAll = fileName.substring(point + 1);
							point = extensionAll.lastIndexOf(".");
							const extension = extensionAll.substring(point + 1);
							const mtime: any = response.mtime;
							const date = mtime.getDate();
							let month = mtime.getMonth();
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
							const year = mtime.getFullYear();
							const time = mtime.toLocaleTimeString();
							filearr = { name, extension, extensionAll, date, month, year, time, verify };
							if (workspace === "sign") {
								dispatch(addSingleFileInWorkspaceSign(filearr));
							} else {
								dispatch(addSingleFileInWorkspaceEnc(filearr));
							}
						},
						err => console.log(err)
					);
				}
				dispatch(readFiles());
				refreshDoc();
			},
			err => {
				dispatch({ type: ADD_FILES_ERROR, payload: fileName, err });
				showToast("Ошибка при добавлении файла");
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
							dispatch({ type: ADD_CERT_ERROR, payload: name + "." + extension, err });
						} else {
							dispatch({ type: ADD_CERT_SUCCESS, payload: name + "." + extension });
							setTimeout(() => {
								showToast("Сертификат успешно добавлен");
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
				let encoding;
				const read = RNFS.read(certPath, 2, 0);

				return read.then(
					response => encoding = "BASE64",
					err => encoding = "DER"
				).then(
					() => NativeModules.Wrap_Cert.saveCertToStore(
						certPath,
						encoding,
						"OTHERS",
						(err, saveCert) => {
							if (err) {
								dispatch({ type: ADD_CERT_ERROR, payload: name + "." + extension, err });
								showToast("Ошибка при добавлении сертификата");
							} else {
								dispatch({ type: ADD_CERT_SUCCESS, payload: name + "." + extension });
								showToast("Сертификат успешно добавлен");
								dispatch(readCertKeys());
							}
						}
					)
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
							dispatch({ type: ADD_KEY_ERROR, payload: name + "." + extension, err });
							showToast("Ошибка при добавлении ключа");
						} else {
							dispatch({ type: ADD_KEY_SUCCESS, payload: name + "." + extension });
							dispatch(readCertKeys());
						}
					});
				break;
			}
			default: {
				showToast("Неподдерживаемое расширение сертификата");
				break;
			}
		}
	};
}