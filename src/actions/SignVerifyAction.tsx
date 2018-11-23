import * as RNFS from "react-native-fs";
import * as request from "request";
import { NativeModules, Linking } from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import { readFiles } from ".";
import { addTempFilesForCryptoarmdDocuments } from "./uploadFileToCryptoArmDocumtsAction";
import { showToast, showToastDanger } from "../utils/toast";
import { clearAllFilesinWorkspaceSign } from "./workspaceAction";
import {
	SIGN_FILE, SIGN_FILE_SUCCESS, SIGN_FILE_ERROR, SIGN_FILE_END,
	VERIFY_SIGN, VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, VERIFY_SIGN_END,
	FETCHING_SIGN_TRUE, FETCHING_SIGN_FALSE, FETCHING_DOC_TRUE, FETCHING_DOC_FALSE
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

interface IPersonalCert {
	cert: {
		category: any,
		chainBuilding: any,
		hasPrivateKey: any,
		isCA: any,
		issuerFriendlyName: any,
		issuerName: any,
		keyUsage: any,
		notAfter: any,
		notBefore: any,
		organizationName: any,
		provider: any,
		publicKeyAlgorithm: any,
		selfSigned: any,
		serialNumber: any,
		signatureAlgorithm: any,
		signatureDigestAlgorithm: any,
		subjectFriendlyName: any,
		subjectName: any,
		type: any,
		version: any
	};
	img: string;
}

export function signFile(files: IFile[], personalCert: IPersonalCert, footer, detached, signature, clearselectedFiles, tempFiles, navigate, isSuccessUpload) {
	return function action(dispatch) {
		dispatch({ type: SIGN_FILE });
		let lengthError = 0;
		let arrDeletedFilesInWorkspacwSign = [];
		let arrAddFilesInWorkspacwSign = [];
		dispatch(clearAllFilesinWorkspaceEnc());
		for (let i = 0; i < footer.arrButton.length; i++) {
			let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll);
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
									personalCert.cert.serialNumber,
									personalCert.cert.category,
									personalCert.cert.provider,
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
											dispatch({ type: SIGN_FILE_ERROR, payload: files[footer.arrButton[i]].name + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll), err });
										} else {
											let indexFile = tempFiles.arrFiles ? tempFiles.arrFiles.findIndex(file => file.filename === (files[footer.arrButton[i]].name + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll))) : -1;
											if (indexFile !== -1) {
												NativeModules.Wrap_Signer.getSignInfo(
													"",
													path,
													encoding,
													false,
													(err, verify) => {
														const data = new FormData();
														let signers = [];
														for (let i = 0; i < verify.length; i++) {
															signers.push({
																subjectFriendlyName: verify[i].subjectFriendlyName,
																issuerFriendlyName: verify[i].issuerFriendlyName,
																notBefore: verify[i].notBefore,
																notAfter: verify[i].notAfter,
																digestAlgorithm: verify[i].signatureAlgorithm,
																signingTime: new Date(verify[i].signingTime).getTime(),
																subjectName: verify[i].subjectName,
																issuerName: verify[i].issuerName
															});
														}
														data.append("signers", JSON.stringify(signers));
														if (tempFiles.extra === null) {
															data.append("extra", null);
														} else {
															data.append("extra", JSON.stringify({ role: tempFiles.extra }));
														}
														data.append("extra", JSON.stringify({ role: tempFiles.extra }));
														data.append("id", tempFiles.arrFiles[indexFile].id);
														(data as any).append("file", {
															uri: RNFS.DocumentDirectoryPath + "/Files/" + tempFiles.arrFiles[indexFile].filename,
															type: null, // or photo.type
															name: tempFiles.arrFiles[indexFile].filename
														});
														fetch(tempFiles.uploadurl + "?command=upload", {
															method: "post",
															body: data
														}).then((res: any) => {
															console.log(res);
															let result = JSON.parse(res._bodyInit);
															RNFS.unlink(RNFS.DocumentDirectoryPath + "/Files/" + tempFiles.arrFiles[indexFile].filename).then(
																() => {
																	dispatch(readFiles());
																	dispatch(clearAllFilesinWorkspaceSign());
																	dispatch(addTempFilesForCryptoarmdDocuments(null, null, null, null, null));
																}
															);
															isSuccessUpload(result.success, tempFiles.chrome, tempFiles.href);
														}).catch(
															err => {
																debugger;
															}
														);
													}
												);
											}

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
							personalCert.cert.serialNumber,
							personalCert.cert.category,
							personalCert.cert.provider,
							path,
							RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + one + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll) + ".sig",
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
									dispatch({ type: SIGN_FILE_ERROR, payload: files[footer.arrButton[i]].name + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll), err });
								} else {
									let indexFile = tempFiles.arrFiles ? tempFiles.arrFiles.findIndex(file => file.filename === (files[footer.arrButton[i]].name + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll))) : -1;
									if (indexFile !== -1) {
										const data = new FormData();
										if (tempFiles.extra === null) {
											data.append("extra", null);
										} else {
											data.append("extra", JSON.stringify({ role: tempFiles.extra }));
										}
										data.append("id", tempFiles.arrFiles[indexFile].id);
										data.append("signers", JSON.stringify({
											subjectFriendlyName: personalCert.cert.subjectFriendlyName,
											issuerFriendlyName: personalCert.cert.issuerFriendlyName,
											notBefore: personalCert.cert.notBefore,
											notAfter: personalCert.cert.notAfter,
											digestAlgorithm: personalCert.cert.signatureAlgorithm,
											signingTime: new Date().getTime(),
											subjectName: personalCert.cert.subjectName,
											issuerName: personalCert.cert.issuerName
										}));
										(data as any).append("file", {
											uri: RNFS.DocumentDirectoryPath + "/Files/" + tempFiles.arrFiles[indexFile].filename + ".sig",
											type: null, // or photo.type
											name: tempFiles.arrFiles[indexFile].filename
										});
										fetch(tempFiles.uploadurl + "?command=upload", {
											method: "post",
											body: data
										}).then((res: any) => {
											console.log(res);
											let result = JSON.parse(res._bodyInit);
											let deleteFileOriginal = RNFS.unlink(RNFS.DocumentDirectoryPath + "/Files/" + tempFiles.arrFiles[indexFile].filename);
											let deleteFileSigned = RNFS.unlink(RNFS.DocumentDirectoryPath + "/Files/" + tempFiles.arrFiles[indexFile].filename + ".sig");
											Promise.all([deleteFileOriginal, deleteFileSigned]).then(() => {
												dispatch(readFiles());
												dispatch(clearAllFilesinWorkspaceSign());
												dispatch(addTempFilesForCryptoarmdDocuments(null, null, null, null, null));
											});
											if (result.success) {
												isSuccessUpload(result.success, tempFiles.chrome, tempFiles.href);
												/*if (tempFiles[0].chrome) {
													Linking.openURL("googlechrome://");
												} else {
													Linking.openURL("https://license.trusted.ru/bitrix/admin/trusted_cryptoarm_docs.php");
												} */
											}
										});
									}
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
									const statFile = RNFS.stat(RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + one + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll) + ".sig");
									statFile.then(
										response => {
											const verify = 0;
											let filearr;
											const name = files[footer.arrButton[i]].name + one;
											const extensionAll = files[footer.arrButton[i]].extensionAll === "" ? "sig" : files[footer.arrButton[i]].extensionAll + ".sig";
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
									if (i === footer.arrButton.length - 1) {
										dispatch({ type: VERIFY_SIGN_END });
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

export function UnSignFile(files: IFile[], footer, clearselectedFiles) {
	return function action(dispatch) {
		dispatch({ type: FETCHING_SIGN_TRUE });
		dispatch({ type: FETCHING_DOC_TRUE });
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
								RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + one + (files[footer.arrButton[i]].extensionAll.substr(0, files[footer.arrButton[i]].extensionAll.length - 4) === "" ? "" : "." + files[footer.arrButton[i]].extensionAll.substr(0, files[footer.arrButton[i]].extensionAll.length - 4)),
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
											dispatch({ type: FETCHING_SIGN_FALSE });
											dispatch({ type: FETCHING_DOC_FALSE });
										}
									} else {
										const request = RNFS.stat(RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + one + (files[footer.arrButton[i]].extensionAll.substr(0, files[footer.arrButton[i]].extensionAll.length - 4) === "" ? "" : "." + files[footer.arrButton[i]].extensionAll.substr(0, files[footer.arrButton[i]].extensionAll.length - 4)));
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
													dispatch({ type: FETCHING_DOC_FALSE });
													dispatch({ type: FETCHING_SIGN_FALSE });
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
		dispatch({ type: FETCHING_SIGN_TRUE });
		dispatch({ type: FETCHING_DOC_TRUE });
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
										navigate("AboutSignCert", { cert: verify[0], isCryptoDoc: false });
									} else {
										navigate("AboutAllSignCert", { cert: verify, isCryptoDoc: false });
									}
								}
								dispatch({ type: FETCHING_DOC_FALSE });
								dispatch({ type: FETCHING_SIGN_FALSE });
							}
						);
					}
				}
			)
		);
	};
}