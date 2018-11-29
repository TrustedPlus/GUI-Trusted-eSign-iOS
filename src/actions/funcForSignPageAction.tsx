import * as RNFS from "react-native-fs";
import * as request from "request";
import { NativeModules, Linking } from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import { readFiles } from ".";
import { addTempFilesForCryptoarmdDocuments, clearTempFiles } from "./uploadFileToCryptoArmDocumtsAction";
import { showToast, showToastDanger } from "../utils/toast";
import { clearAllFilesinWorkspaceSign } from "./workspaceAction";
import {
	SIGN_FILE, SIGN_FILE_SUCCESS, SIGN_FILE_ERROR, SIGN_FILE_END,
	VERIFY_SIGN, VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, VERIFY_SIGN_END,
	FETCHING_SIGN_TRUE, FETCHING_SIGN_FALSE, FETCHING_DOC_TRUE, FETCHING_DOC_FALSE,
	VERIFY_SIGN_FILES_CRYPTOARMDOC_SUCCESS, VERIFY_SIGN_FILES_CRYPTOARMDOC_ERROR
} from "../constants";
import { addSingleFileInWorkspaceSign, clearOriginalFileInWorkspaceSign, clearAllFilesinWorkspaceEnc } from "./workspaceAction";

interface IFile {
	mtime: Date;
	extension: string;
	extensionAll: string;
	name: string;
	verify: number;
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

export function signFile(tempFiles, personalCert: IPersonalCert, signature, detached, isSuccessUpload) {
	return function action(dispatch) {
		dispatch({ type: SIGN_FILE });
		let lengthError = 0, promises = [], resultArr = [];
		dispatch(clearAllFilesinWorkspaceEnc());
		tempFiles.arrFiles.map(
			(file, i) => {
				promises.push(
					new Promise((resolve, reject) => {
						let path = file.stat.path;

						if (file.extension === "sig") {
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
											resolve();
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
														if (i === tempFiles.arrFiles.length - 1) {
															if ((tempFiles.arrFiles.length === 1) && (lengthError === 1)) {
																showToast("Ошибка при добавлении подписи");
															}
															if ((tempFiles.arrFiles.length === 1) && (lengthError === 0)) {
																showToast("Подпись была добавлена");
															}
															if ((tempFiles.arrFiles.length > 1) && (lengthError === tempFiles.arrFiles.length)) {
																showToast("Ошибка при добавлении подписи");
															}
															if ((tempFiles.arrFiles.length > 1) && (lengthError > 0)) {
																showToast("Для некоторых файлов подпись не смогла быть добавлена");
															}
															dispatch({ type: SIGN_FILE_END });
														}
														resolve();
														dispatch({ type: SIGN_FILE_ERROR, payload: file.filename, err });
													} else {
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
																data.append("id", file.id);
																(data as any).append("file", {
																	uri: path,
																	type: null, // or photo.type
																	name: file.filename
																});
																fetch(tempFiles.uploadurl + "?command=upload", {
																	method: "post",
																	body: data
																}).then((res: any) => {
																	console.log(res);
																	let result = JSON.parse(res._bodyInit);
																	RNFS.unlink(path).then(
																		() => {
																			dispatch(clearTempFiles());
																		}
																	);
																	resultArr.push(result.success);
																	resolve();
																}).catch(
																	err => {
																		resolve();
																		debugger;
																	}
																);
															}
														);
														dispatch({ type: SIGN_FILE_SUCCESS, payload: file.filename });
													}
												}
											);
										}
									}
								)
							);
						} else {
							NativeModules.Wrap_Signer.sign(
								personalCert.cert.serialNumber,
								personalCert.cert.category,
								personalCert.cert.provider,
								path,
								path,
								signature === "BASE-64" ? "BASE64" : "DER",
								detached,
								(err) => {
									if (err) {
										lengthError++;
										if (i === tempFiles.arrFiles.length - 1) {
											dispatch({ type: SIGN_FILE_END });
										}
										if (err.indexOf("-2146893802") !== -1) {
											showToastDanger("Не найден закрытый ключ для сертификата подписи");
										} else {
											showToastDanger(err);
										}
										resolve();
										dispatch({ type: SIGN_FILE_ERROR, payload: file.filename, err });
									} else {
										const data = new FormData();
										if (tempFiles.extra === null) {
											data.append("extra", null);
										} else {
											data.append("extra", JSON.stringify({ role: tempFiles.extra }));
										}
										data.append("id", file.id);
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
											uri: path,
											type: null, // or photo.type
											name: file.filename
										});
										fetch(tempFiles.uploadurl + "?command=upload", {
											method: "post",
											body: data
										}).then((res: any) => {
											console.log(res);
											let result = JSON.parse(res._bodyInit);
											RNFS.unlink(path).then(() => {
												dispatch(clearTempFiles());
											});
											resultArr.push(result.success);
											resolve();
										});
										dispatch({ type: SIGN_FILE_SUCCESS, payload: file.filename });
									}
								}
							);
						}
					})
				);
			}
		);
		Promise.all(promises).then(
			() => {
				isSuccessUpload(resultArr, tempFiles.chrome, tempFiles.href);
				dispatch({ type: SIGN_FILE_END });
			}
		);
	};
}

export function verifySign(path, filename, itsCryptoArmDocuments) {
	return function action(dispatch) {
		dispatch({ type: VERIFY_SIGN });
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
									if (itsCryptoArmDocuments) {
										dispatch({ type: VERIFY_SIGN_FILES_CRYPTOARMDOC_ERROR, payload: filename, err });
									} else {
										dispatch({ type: VERIFY_SIGN_ERROR, payload: filename, err });
									}
								} else {
									showToast("Подпись достоверна");
									if (itsCryptoArmDocuments) {
										dispatch({ type: VERIFY_SIGN_FILES_CRYPTOARMDOC_SUCCESS, payload: filename });
									} else {
										dispatch({ type: VERIFY_SIGN_SUCCESS, payload: filename });
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

export function getSignInfo(path, navigate) {
	return function action(dispatch) {
		dispatch({ type: FETCHING_SIGN_TRUE });
		dispatch({ type: FETCHING_DOC_TRUE });
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