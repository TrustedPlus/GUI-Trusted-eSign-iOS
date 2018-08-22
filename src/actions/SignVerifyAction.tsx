import * as RNFS from "react-native-fs";
import { NativeModules, Alert } from "react-native";
import { readFiles } from ".";
import { showToast, showToastDanger } from "../utils/toast";
import {
	SIGN_FILE, SIGN_FILE_SUCCESS, SIGN_FILE_ERROR, SIGN_FILE_END,
	VERIFY_SIGN, VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, VERIFY_SIGN_END
} from "../constants";
import { addSingleFileInWorkspaceSign, clearOriginalFileInWorkspaceSign, clearAllFilesinWorkspaceEnc } from "./workspaceAction";

interface IFile {
	date: string;
	time: string;
	month: string;
	year: string;
	extension: string;
	extensionAll: string;
	name: string;
}

export function signFile(files: IFile[], personalCert, footer, detached, signature, clearselectedFiles) {
	return function action(dispatch) {
		dispatch({ type: SIGN_FILE });
		let lengthError = 0;
		let arrDeletedFilesInWorkspacwSign = [];
		let arrAddFilesInWorkspacwSign = [];
		dispatch(clearAllFilesinWorkspaceEnc());
		for (let i = 0; i < footer.arrButton.length; i++) {
			let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
			if (files[footer.arrButton[i]].extension === "sig") {
				const read = RNFS.read(path, 2, 0, "utf8");
				let encoding;
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
								arrDeletedFilesInWorkspacwSign.push({ name: files[footer.arrButton[i]].name, extensionAll: files[footer.arrButton[i]].extensionAll });
								arrAddFilesInWorkspacwSign.push({ name: files[footer.arrButton[i]].name, extension: files[footer.arrButton[i]].extension, extensionAll: files[footer.arrButton[i]].extensionAll, date: files[footer.arrButton[i]].date, month: files[footer.arrButton[i]].month, year: files[footer.arrButton[i]].year, time: files[footer.arrButton[i]].time, verify: 0 });
								if (i === footer.arrButton.length - 1) {
									for (let i = 0; i < arrDeletedFilesInWorkspacwSign.length; i++) {
										dispatch(clearOriginalFileInWorkspaceSign(arrDeletedFilesInWorkspacwSign[i].name, arrDeletedFilesInWorkspacwSign[i].extensionAll));
									}
									for (let i = 0; i < arrAddFilesInWorkspacwSign.length; i++) {
										dispatch(addSingleFileInWorkspaceSign(arrAddFilesInWorkspacwSign[i]));
									}
									dispatch({ type: SIGN_FILE_END });
									clearselectedFiles();
								}
							} else {
								NativeModules.Wrap_Signer.coSign(
									personalCert.serialNumber,
									personalCert.category,
									personalCert.provider,
									verify ? path.substring(0, path.length - 4) : "",
									path,
									encoding,
									verify ? true : false,
									(err) => {
										if (err) {
											lengthError++;
											clearselectedFiles(footer.arrButton[i]);
											arrDeletedFilesInWorkspacwSign.push({ name: files[footer.arrButton[i]].name, extensionAll: files[footer.arrButton[i]].extensionAll });
											arrAddFilesInWorkspacwSign.push({ name: files[footer.arrButton[i]].name, extension: files[footer.arrButton[i]].extension, extensionAll: files[footer.arrButton[i]].extensionAll, date: files[footer.arrButton[i]].date, month: files[footer.arrButton[i]].month, year: files[footer.arrButton[i]].year, time: files[footer.arrButton[i]].time, verify: 0 });
											if (i === footer.arrButton.length - 1) {
												for (let i = 0; i < arrDeletedFilesInWorkspacwSign.length; i++) {
													dispatch(clearOriginalFileInWorkspaceSign(arrDeletedFilesInWorkspacwSign[i].name, arrDeletedFilesInWorkspacwSign[i].extensionAll));
												}
												for (let i = 0; i < arrAddFilesInWorkspacwSign.length; i++) {
													dispatch(addSingleFileInWorkspaceSign(arrAddFilesInWorkspacwSign[i]));
												}
												if ((footer.arrButton.length === 1) && (lengthError === 1)) {
													showToast("Ошибка при добавлении подписи");
												}
												if ((footer.arrButton.length === 1) && (lengthError === 0)) {
													showToast("Подпись была добавлена");
												}
												if ((footer.arrButton.length > 1) && (lengthError === footer.arrButton.length)) {
													showToast("Ошибка при добавлении подписи");
												}
												if ((footer.arrButton.length > 1) && (lengthError > 0)) {
													showToast("Для некоторых файлов подпись не смогла быть добавлена");
												}
												clearselectedFiles();
												dispatch({ type: SIGN_FILE_END });
											}
											dispatch({ type: SIGN_FILE_ERROR, payload: files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll, err });
										} else {
											const request = RNFS.stat(path);
											request.then(
												response => {
													const verify = 0;
													let filearr;
													const name = files[footer.arrButton[i]].name;
													const extensionAll = files[footer.arrButton[i]].extensionAll;
													const extension = "sig";
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
													dispatch(addSingleFileInWorkspaceSign(filearr));
													if (i === footer.arrButton.length - 1) {
														for (let i = 0; i < arrDeletedFilesInWorkspacwSign.length; i++) {
															dispatch(clearOriginalFileInWorkspaceSign(arrDeletedFilesInWorkspacwSign[i].name, arrDeletedFilesInWorkspacwSign[i].extensionAll));
														}
														for (let i = 0; i < arrAddFilesInWorkspacwSign.length; i++) {
															dispatch(addSingleFileInWorkspaceSign(arrAddFilesInWorkspacwSign[i]));
														}
														clearselectedFiles();
														dispatch({ type: SIGN_FILE_END });
													}
												},
												err => console.log(err)
											);
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
											dispatch({ type: SIGN_FILE_SUCCESS, payload: files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll });
										}
									}
								);
							}
						}
					)
				);
			} else {
				let one = "";
				RNFS.exists(path + ".sig").then(
					response => {
						if (response) {
							one = "(1)";
						}
						NativeModules.Wrap_Signer.sign(
							personalCert.serialNumber,
							personalCert.category,
							personalCert.provider,
							path,
							RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + one + "." + files[footer.arrButton[i]].extensionAll + ".sig",
							signature === "BASE-64" ? "BASE64" : "DER",
							detached,
							(err) => {
								if (err) {
									lengthError++;
									arrDeletedFilesInWorkspacwSign.push({ name: files[footer.arrButton[i]].name, extensionAll: files[footer.arrButton[i]].extensionAll });
									arrAddFilesInWorkspacwSign.push({ name: files[footer.arrButton[i]].name, extension: files[footer.arrButton[i]].extension, extensionAll: files[footer.arrButton[i]].extensionAll, date: files[footer.arrButton[i]].date, month: files[footer.arrButton[i]].month, year: files[footer.arrButton[i]].year, time: files[footer.arrButton[i]].time, verify: 0 });
									if (i === footer.arrButton.length - 1) {
										for (let i = 0; i < arrDeletedFilesInWorkspacwSign.length; i++) {
											dispatch(clearOriginalFileInWorkspaceSign(arrDeletedFilesInWorkspacwSign[i].name, arrDeletedFilesInWorkspacwSign[i].extensionAll));
										}
										for (let i = 0; i < arrAddFilesInWorkspacwSign.length; i++) {
											dispatch(addSingleFileInWorkspaceSign(arrAddFilesInWorkspacwSign[i]));
										}
										clearselectedFiles();
										dispatch({ type: SIGN_FILE_END });
									}
									if (err.indexOf("-2146893802") !== -1) {
										showToastDanger("Не найден закрытый ключ для сертификата подписи");
									} else {
										showToastDanger(err);
									}
									dispatch({ type: SIGN_FILE_ERROR, payload: files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll, err });
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
									const request = RNFS.stat(RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + one + "." + files[footer.arrButton[i]].extensionAll + ".sig");
									request.then(
										response => {
											const verify = 0;
											let filearr;
											const name = files[footer.arrButton[i]].name + one;
											const extensionAll = files[footer.arrButton[i]].extensionAll + ".sig";
											const extension = "sig";
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
											dispatch(addSingleFileInWorkspaceSign(filearr));
											arrDeletedFilesInWorkspacwSign.push({ name: files[footer.arrButton[i]].name, extensionAll: files[footer.arrButton[i]].extensionAll });
											if (i === footer.arrButton.length - 1) {
												for (let i = 0; i < arrDeletedFilesInWorkspacwSign.length; i++) {
													dispatch(clearOriginalFileInWorkspaceSign(arrDeletedFilesInWorkspacwSign[i].name, arrDeletedFilesInWorkspacwSign[i].extensionAll));
												}
												for (let i = 0; i < arrAddFilesInWorkspacwSign.length; i++) {
													dispatch(addSingleFileInWorkspaceSign(arrAddFilesInWorkspacwSign[i]));
												}
												clearselectedFiles();
												dispatch({ type: SIGN_FILE_END });
											}
										},
										err => console.log(err)
									);
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
									dispatch({ type: SIGN_FILE_SUCCESS, payload: files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll });
								}
							}
						);
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
							if (err.indexOf("PEM_read_bio_CMS") !== -1) {
								showToastDanger("Ошибка чтения файла подписи");
							} else {
								showToastDanger(err);
							}
						} else {
							NativeModules.Wrap_Signer.verify(
								verify ? path.substring(0, path.length - 4) : "",
								path,
								encoding,
								verify ? true : false,
								(err) => {
									if (err) {
										console.log(err);
										if (err.indexOf("readFile Cannot open input file.") !== -1) {
											showToastDanger("Отделенная подпись. Для проверки необходимо переместить исходный файл в Документы");
										} else if (err.indexOf("For one of the signed certificates, the chain could not be established.") !== -1) {
											showToastDanger("Для одного из сертификатов, подписавших файл, цепочка не может быть построена");
										} else if (err.indexOf("Signature not validated!") !== -1) {
											showToastDanger("Подпись недействительна");
										} else if (err.indexOf("0x80090005") !== -1) {
											showToastDanger("Недействительный сертификат подписи");
										} else {
											showToastDanger(err);
										}
										dispatch({ type: VERIFY_SIGN_ERROR, payload: files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll, err });
									} else {
										showToast("Подпись достоверна");
										dispatch({ type: VERIFY_SIGN_SUCCESS, payload: files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll });
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

export function UnSignFile(files: IFile[], footer, clearselectedFiles) {
	return function action(dispatch) {
		dispatch(clearAllFilesinWorkspaceEnc());
		let arrAddFilesInWorkspacwSign = [];
		let arrDeletedFilesInWorkspacwSign = [];
		for (let i = 0; i < footer.arrButton.length; i++) {
			let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + "." + files[footer.arrButton[i]].extensionAll;
			let encoding;
			const read = RNFS.read(path, 2, 0, "utf8");

			read.then(
				success => encoding = "BASE64",
				err => encoding = "DER"
			).then(
				() => {
					let one = "";
					RNFS.exists(path.substr(0, path.length - 4)).then(
						response => {
							if (response) {
								one = "(1)";
							}
							NativeModules.Wrap_Signer.unSign(
								path,
								encoding,
								RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + one + "." + files[footer.arrButton[i]].extensionAll.substr(0, files[footer.arrButton[i]].extensionAll.length - 4),
								(err) => {
									if (err) {
										showToastDanger("Открепленная подпись. При снятии подписи произошла ошибка.");
										arrDeletedFilesInWorkspacwSign.push({ name: files[footer.arrButton[i]].name, extensionAll: files[footer.arrButton[i]].extensionAll });
										arrAddFilesInWorkspacwSign.push({ name: files[footer.arrButton[i]].name, extension: files[footer.arrButton[i]].extension, extensionAll: files[footer.arrButton[i]].extensionAll, date: files[footer.arrButton[i]].date, month: files[footer.arrButton[i]].month, year: files[footer.arrButton[i]].year, time: files[footer.arrButton[i]].time, verify: 0 });
										if (i === footer.arrButton.length - 1) {
											for (let i = 0; i < arrDeletedFilesInWorkspacwSign.length; i++) {
												dispatch(clearOriginalFileInWorkspaceSign(arrDeletedFilesInWorkspacwSign[i].name, arrDeletedFilesInWorkspacwSign[i].extensionAll));
											}
											for (let i = 0; i < arrAddFilesInWorkspacwSign.length; i++) {
												dispatch(addSingleFileInWorkspaceSign(arrAddFilesInWorkspacwSign[i]));
											}
											clearselectedFiles();
										}
									} else {
										const request = RNFS.stat(RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + one + "." + files[footer.arrButton[i]].extensionAll.substr(0, files[footer.arrButton[i]].extensionAll.length - 4));
										request.then(
											response => {
												const verify = 0;
												let filearr;
												const name = files[footer.arrButton[i]].name + one;
												const extensionAll = files[footer.arrButton[i]].extensionAll.substr(0, files[footer.arrButton[i]].extensionAll.length - 4);
												const point = extensionAll.lastIndexOf(".");
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
												dispatch(addSingleFileInWorkspaceSign(filearr));
												arrDeletedFilesInWorkspacwSign.push({ name: files[footer.arrButton[i]].name, extensionAll: files[footer.arrButton[i]].extensionAll });
												if (i === footer.arrButton.length - 1) {
													for (let i = 0; i < arrDeletedFilesInWorkspacwSign.length; i++) {
														dispatch(clearOriginalFileInWorkspaceSign(arrDeletedFilesInWorkspacwSign[i].name, arrDeletedFilesInWorkspacwSign[i].extensionAll));
													}
													for (let i = 0; i < arrAddFilesInWorkspacwSign.length; i++) {
														dispatch(addSingleFileInWorkspaceSign(arrAddFilesInWorkspacwSign[i]));
													}
													clearselectedFiles();
												}
											},
											err => console.log(err)
										);
										dispatch(readFiles());
										showToast("Подпись была успешно снята");
									}
								}
							);
						}
					);
				});
		}
	};
}

export function getSignInfo(files: IFile[], footer, navigate) {
	return function action(dispatch) {
		let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[0]].name + "." + files[footer.arrButton[0]].extensionAll;
		let encoding;
		const read = RNFS.read(path, 2, 0, "utf8");

		read.then(
			success => encoding = "BASE64",
			err => encoding = "DER"
		).then(
			() => NativeModules.Wrap_Signer.isDetachedSignMessage(
				path,
				encoding,
				(err, isDetached) => {
					if (err) {
						showToastDanger(err);
					} else {
						NativeModules.Wrap_Signer.getSignInfo(
							isDetached ? path.substring(0, path.length - 4) : "",
							path,
							encoding,
							isDetached ? true : false,
							(err, verify) => {
								if (err) {
									showToastDanger(err);
								} else {
									if (verify.length === 1) {
										navigate("AboutSignCert", { cert: verify[0] });
									} else {
										navigate("AboutAllSignCert", { cert: verify });
									}
								}
							}
						);
					}
				}
			)
		);
	};
}