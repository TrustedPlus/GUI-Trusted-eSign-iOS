import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";
import { readFiles } from ".";
import { showToast, showToastDanger } from "../utils/toast";
import {
	ENCODE_FILES, ENCODE_FILES_SUCCESS, ENCODE_FILES_ERROR, ENCODE_FILES_END,
	DECODE_FILES, DECODE_FILES_SUCCESS, DECODE_FILES_ERROR, DECODE_FILES_END,
	FETCHING_ENC_TRUE, FETCHING_ENC_FALSE, FETCHING_DOC_TRUE, FETCHING_DOC_FALSE
} from "../constants";
import { addSingleFileInWorkspaceEnc, clearOriginalFileInWorkspaceEnc, clearAllFilesinWorkspaceSign } from "./workspaceAction";

interface IFile {
	date: string;
	time: string;
	month: string;
	year: string;
	extension: string;
	extensionAll: string;
	name: string;
}

export function encAssymmetric(files: IFile[], otherCert, footer, signature, deleteAfter, clearselectedFiles) {
	return function action(dispatch) {
		dispatch({ type: FETCHING_ENC_TRUE });
		dispatch(clearAllFilesinWorkspaceSign());
		let arrAddFilesInWorkspacwEnc = [];
		let arrDeletedFilesInWorkspacwEnc = [];
		if (!otherCert.arrEncCertificates.length) {
			return dispatch({ type: ENCODE_FILES_END });
		} else {
			for (let i = 0; i < footer.arrButton.length; i++) {
				let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll);
				let selectedCertificates = [];
				otherCert.arrEncCertificates.map((cert) => {
					selectedCertificates.push(cert.serialNumber);
					selectedCertificates.push(cert.category);
				});
				let one = "";
				RNFS.exists(path + ".enc").then(
					response => {
						if (response) {
							one = "(1)";
						}
						NativeModules.Wrap_Cipher.encrypt(
							selectedCertificates,
							otherCert.arrEncCertificates[0].provider,
							path,
							RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + one + (files[footer.arrButton[i]].extensionAll === "" ? ".enc" : "." + files[footer.arrButton[i]].extensionAll + ".enc"),
							signature === "BASE-64" ? "BASE64" : "DER",
							(err) => {
								if (err) {
									showToastDanger(err);
									arrDeletedFilesInWorkspacwEnc.push({ name: files[footer.arrButton[i]].name, extensionAll: files[footer.arrButton[i]].extensionAll });
									arrAddFilesInWorkspacwEnc.push({ name: files[footer.arrButton[i]].name, extension: files[footer.arrButton[i]].extension, extensionAll: files[footer.arrButton[i]].extensionAll, date: files[footer.arrButton[i]].date, month: files[footer.arrButton[i]].month, year: files[footer.arrButton[i]].year, time: files[footer.arrButton[i]].time, verify: 0 });
									if (i === footer.arrButton.length - 1) {
										for (let k = 0; k < arrDeletedFilesInWorkspacwEnc.length; k++) {
											dispatch(clearOriginalFileInWorkspaceEnc(arrDeletedFilesInWorkspacwEnc[k].name, arrDeletedFilesInWorkspacwEnc[k].extensionAll));
										}
										for (let i = 0; i < arrAddFilesInWorkspacwEnc.length; i++) {
											dispatch(addSingleFileInWorkspaceEnc(arrAddFilesInWorkspacwEnc[i]));
										}
										dispatch({ type: FETCHING_ENC_FALSE });
										clearselectedFiles();
									}
									dispatch({ type: ENCODE_FILES_ERROR, payload: files[footer.arrButton[i]].name + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll), err });
								} else {
									// RNFS.copyFile(path + ".enc", "/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll + ".enc");
									const request = RNFS.stat(RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + one  + (files[footer.arrButton[i]].extensionAll === "" ? ".enc" : "." + files[footer.arrButton[i]].extensionAll + ".enc"));
									request.then(
										response => {
											let filearr;
											const name = files[footer.arrButton[i]].name + one;
											const extensionAll = files[footer.arrButton[i]].extensionAll === "" ? "enc" : files[footer.arrButton[i]].extensionAll + ".enc";
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
												for (let i = 0; i < arrAddFilesInWorkspacwEnc.length; i++) {
													dispatch(addSingleFileInWorkspaceEnc(arrAddFilesInWorkspacwEnc[i]));
												}
												dispatch({ type: FETCHING_ENC_FALSE });
												clearselectedFiles();
											}
										},
										err => console.log(err)
									);
									dispatch(readFiles());
									dispatch({ type: ENCODE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll) });
									if (deleteAfter) { RNFS.unlink(path); showToast("Файл успешно зашифрован\nИсходный файл был удален"); } else {
										showToast("Файл успешно зашифрован");
									}
								}
							}
						);
					}
				);
			}
		}
	};
}

export function decAssymmetric(files: IFile[], footer, clearselectedFiles: Function) {
	return function action(dispatch) {
		dispatch({ type: FETCHING_DOC_TRUE });
		dispatch({ type: FETCHING_ENC_TRUE });
		dispatch(clearAllFilesinWorkspaceSign());
		let arrAddFilesInWorkspacwEnc = [];
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
				() => {
					let one = "";
					RNFS.exists(path + "." + extension).then(
						response => {
							if (response) {
								one = "(1)";
							}
							NativeModules.Wrap_Cipher.decrypt(
								path + "." + files[footer.arrButton[i]].extensionAll,
								encoding,
								path + one + (extension === "" ? "" : "." + extension),
								(err) => {
									if (err) {
										let index = err.indexOf("2146885620");
										if (index !== -1) {
											showToastDanger("Не найден закрытый ключ для расшифрования");
										} else {
											showToastDanger(err);
										}
										arrDeletedFilesInWorkspacwEnc.push({ name: files[footer.arrButton[i]].name, extensionAll: files[footer.arrButton[i]].extensionAll });
										arrAddFilesInWorkspacwEnc.push({ name: files[footer.arrButton[i]].name, extension: files[footer.arrButton[i]].extension, extensionAll: files[footer.arrButton[i]].extensionAll, date: files[footer.arrButton[i]].date, month: files[footer.arrButton[i]].month, year: files[footer.arrButton[i]].year, time: files[footer.arrButton[i]].time, verify: 0 });
										if (i === footer.arrButton.length - 1) {
											for (let k = 0; k < arrDeletedFilesInWorkspacwEnc.length; k++) {
												dispatch(clearOriginalFileInWorkspaceEnc(arrDeletedFilesInWorkspacwEnc[k].name, arrDeletedFilesInWorkspacwEnc[k].extensionAll));
											}
											for (let i = 0; i < arrAddFilesInWorkspacwEnc.length; i++) {
												dispatch(addSingleFileInWorkspaceEnc(arrAddFilesInWorkspacwEnc[i]));
											}
											dispatch({ type: FETCHING_ENC_FALSE });
											dispatch({ type: FETCHING_DOC_FALSE });
											clearselectedFiles();
										}
										dispatch({ type: DECODE_FILES_ERROR, payload: files[footer.arrButton[i]].name + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll), err });
									} else {
										// RNFS.copyFile(path + "." + extension, "/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + files[footer.arrButton[i]].name + "." + extension);
										dispatch({ type: DECODE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll)});
										const request = RNFS.stat(path + one + (extension === "" ? "" : "." + extension));
										request.then(
											response => {
												let filearr, extensionAll, extensionNewFiles;
												const name = files[footer.arrButton[i]].name + one;
												if (extension === "") {
												extensionAll = "";
												extensionNewFiles = "";
												} else {
													extensionAll = extension;
													let point = extensionAll.lastIndexOf(".");
													extensionNewFiles = extensionAll.substring(point + 1);
												}
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
													for (let i = 0; i < arrAddFilesInWorkspacwEnc.length; i++) {
														dispatch(addSingleFileInWorkspaceEnc(arrAddFilesInWorkspacwEnc[i]));
													}
													dispatch({ type: FETCHING_ENC_FALSE });
													dispatch({ type: FETCHING_DOC_FALSE });
													clearselectedFiles();
												}
											},
											err => console.log(err)
										);
										dispatch(readFiles());
										showToast("Файл успешно расшифрован");
									}
								}
							);
						}
					);
				}
			);
		}
	};
}