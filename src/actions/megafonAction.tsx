import * as RNFS from "react-native-fs";
import * as soap from "soap-everywhere";
import * as request from "request";
import { NativeModules, Linking, AlertIOS } from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import { readFiles } from ".";
import { addTempFilesForCryptoarmdDocuments } from "./uploadFileToCryptoArmDocumtsAction";
import { showToast, showToastDanger } from "../utils/toast";
import { clearAllFilesinWorkspaceSign } from "./workspaceAction";
import { toBase64, fromBase64 } from "pvutils";
import {
	SIGN_FILE, SIGN_FILE_SUCCESS, SIGN_FILE_ERROR, SIGN_FILE_END,
	VERIFY_SIGN, VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, VERIFY_SIGN_END,
	FETCHING_SIGN_TRUE, FETCHING_SIGN_FALSE, FETCHING_DOC_TRUE, FETCHING_DOC_FALSE
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
		version: any,
		transaction_id?: string
	};
	img: string;
}

export function signFileMegafon(files: IFile[], personalCert: IPersonalCert, footer, detached, signature, clearselectedFiles) {
	return function action(dispatch) {
		dispatch({ type: SIGN_FILE });
		let lengthError = 0;
		let arrDeletedFilesInWorkspacwSign = [];
		let arrAddFilesInWorkspacwSign = [];
		dispatch(clearAllFilesinWorkspaceEnc());
		for (let i = 0; i < footer.arrButton.length; i++) {
			let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll);
			let one = "";
			RNFS.exists(path + ".sig").then(
				response => {
					if (response) {
						one = "(1)";
					}
					RNFetchBlob.fs.readFile(path, "utf8").then(
						success => {
							let url = "https://msign.megafon.ru/mes-ws/sign?wsdl";
							let args = {
								partner_id: "digt",
								transaction_id: personalCert.cert.transaction_id,
								text: toBase64("Подтвердите подпись \"" + files[footer.arrButton[i]].name + "\""),
								document: toBase64(success),
								signType: "Attached",
								digest: "1D040C15"
							};
							soap.createClient(url, (err, client) => {
								console.log(client);
								client.signDocument(args, (err, result) => {
									console.log(result);
									// AlertIOS.alert("status: " + result.status + "\ntransaction_id: " + result.transaction_id);
									if (result.status === "100") {
										RNFS.writeFile(path + one + ".sig", "-----BEGIN CMS-----\n" + result.cms + "\n-----END CMS-----", "utf8")
											.then((success) => {
												console.log("FILE WRITTEN!");
												dispatch(readFiles());
											})
											.catch((err) => {
												console.log(err.message);
											});
										// connectToMregafon(result.transaction_id, this.state.key);
									}
									dispatch({ type: SIGN_FILE_END });
								});
							});
						},
						err => {
							debugger;
							console.log(err.message);
							dispatch({ type: SIGN_FILE_END });
						}
					);
				}
			);
		}
	};
}

export function verifyMeggafon(files: IFile[], footer) {
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
							RNFetchBlob.fs.readFile(path, "utf8").then(
								success => {
									let url = "https://msign.megafon.ru/mes-ws/sign?wsdl";
									let args = {
										partner_id: "digt",
										document: toBase64(success),
										signature: toBase64(success)
									};
									soap.createClient(url, (err, client) => {
										console.log(client);
										client.verify(args, (err, result) => {
											console.log(result);
											// AlertIOS.alert("status: " + result.status + "\ntransaction_id: " + result.transaction_id);
											dispatch({ type: SIGN_FILE_END });
										});
									});
								},
								err => {
									debugger;
									console.log(err.message);
									dispatch({ type: SIGN_FILE_END });
								}
							);
						}
					}
				)
			);
		}
	};
}



/*

if (err) {
		lengthError++;
		arrDeletedFilesInWorkspacwSign.push({ name: files[footer.arrButton[i]].name, extensionAll: files[footer.arrButton[i]].extensionAll });
		arrAddFilesInWorkspacwSign.push({ name: files[footer.arrButton[i]].name, extension: files[footer.arrButton[i]].extension, extensionAll: files[footer.arrButton[i]].extensionAll, mtime: files[footer.arrButton[i]].mtime, verify: 0 });
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
		);
		const statFile = RNFS.stat(RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name + one + (files[footer.arrButton[i]].extensionAll === "" ? "" : "." + files[footer.arrButton[i]].extensionAll) + ".sig");
		statFile.then(
			response => {
				const verify = 0;
				let filearr;
				const name = files[footer.arrButton[i]].name + one;
				const extensionAll = files[footer.arrButton[i]].extensionAll === "" ? "sig" : files[footer.arrButton[i]].extensionAll + ".sig";
				const extension = "sig";
				const mtime: any = response.mtime;
				filearr = { name, extension, extensionAll, mtime, verify };
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
	*/