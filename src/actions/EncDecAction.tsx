import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";
import { readFiles } from "../actions/index";
import { showToast, showToastDanger } from "../utils/toast";
import {
	ENCODE_FILES, ENCODE_FILES_SUCCESS, ENCODE_FILES_ERROR, ENCODE_FILES_END,
	DECODE_FILES, DECODE_FILES_SUCCESS, DECODE_FILES_ERROR, DECODE_FILES_END
} from "../constants";
import { addSingleFileInWorkspaceEnc, clearOriginalFileInWorkspaceEnc } from "./workspaceAction";

interface IFile {
	mtime: string;
	extension: string;
	extensionAll: string;
	name: string;
}

export function encAssymmetric(files: IFile[], otherCert, footer, signature, deleteAfter, clearselectedFiles) {
	return function action(dispatch) {
		dispatch({ type: ENCODE_FILES });
		clearselectedFiles();
		let arrDeletedFilesInWorkspacwEnc = [];
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
							const request = RNFS.stat(path + ".enc");
							request.then(
								response => {
									let filearr;
									const name = files[footer.arrButton[i]].name;
									const extensionAll = files[footer.arrButton[i]].extensionAll + ".enc";
									const extension = "enc";
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
									filearr = { name, extension, extensionAll, date, month, year, time };
									dispatch(addSingleFileInWorkspaceEnc(filearr));
									arrDeletedFilesInWorkspacwEnc.push({ name: files[footer.arrButton[i]].name, extensionAll: files[footer.arrButton[i]].extensionAll });
									if (i === footer.arrButton.length - 1) {
										for (let k = 0; k < arrDeletedFilesInWorkspacwEnc.length; k++) {
											dispatch(clearOriginalFileInWorkspaceEnc(arrDeletedFilesInWorkspacwEnc[k].name, arrDeletedFilesInWorkspacwEnc[k].extensionAll));
										}
									}
								},
								err => console.log(err)
							);
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

export function decAssymmetric(files: IFile[], footer, clearselectedFiles: Function) {
	return function action(dispatch) {
		dispatch({ type: DECODE_FILES });
		let arrDeletedFilesInWorkspacwEnc = [];
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
							const request = RNFS.stat(path + "." + extension);
							request.then(
								response => {
									let filearr;
									const name = files[footer.arrButton[i]].name;
									const extensionAll = extension;
									let point = extensionAll.lastIndexOf(".");
									const extensionNewFiles = extensionAll.substring(point + 1);
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
									filearr = { name, extension: extensionNewFiles, extensionAll, date, month, year, time };
									dispatch(addSingleFileInWorkspaceEnc(filearr));
									arrDeletedFilesInWorkspacwEnc.push({ name: files[footer.arrButton[i]].name, extensionAll: files[footer.arrButton[i]].extensionAll });
									if (i === footer.arrButton.length - 1) {
										for (let k = 0; k < arrDeletedFilesInWorkspacwEnc.length; k++) {
											dispatch(clearOriginalFileInWorkspaceEnc(arrDeletedFilesInWorkspacwEnc[k].name, arrDeletedFilesInWorkspacwEnc[k].extensionAll));
										}
									}
								},
								err => console.log(err)
							);
							showToast("Файл успешно расшифрован");
						}
					}
				)
			);
		}
		setTimeout(() => {
			dispatch(readFiles());
			clearselectedFiles();
		}, 400);
	};
}