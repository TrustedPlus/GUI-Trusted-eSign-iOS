import RNFetchBlob from "rn-fetch-blob";
import * as RNFS from "react-native-fs";
import { showToast, showToastDanger } from "../utils/toast";
import { NativeModules } from "react-native";

export function takeUrl(url, addTempFilesForCryptoarmdDocuments, addFiles, navigate) {
	let id, getfileurl, getnamefile, uploadurl;
	let result = url.match(/cryptoarmgost:\/\/.{1,}\?id/);
	if (result !== null) {
		let page = result[0].slice(16, -4);
		let chrome = /chrome/.test(url);
		switch (page) {
			case "verify":
				result = url.match(/\?id=.{1,}\?url/);
				id = result[0].slice(4, -4);
				result = url.match(/\?url=.{1,}\?filename/);
				getfileurl = result[0].slice(5, -9);
				result = url.match(/\?filename=.{1,}\?command=verify/);
				getnamefile = result[0].slice(10, -15);

				RNFetchBlob
					.config({
						fileCache: true
					})
					.fetch("POST", getfileurl)
					.then((res) => {
						// the path should be dirs.DocumentDir + 'path-to-file.anything'
						console.log("The file saved to ", res.path());

						let encoding;
						const read = RNFS.read(res.path(), 2, 0, "utf8");
						read.then(
							success => encoding = "BASE64",
							err => encoding = "DER"
						).then(
							() => NativeModules.Wrap_Signer.isDetachedSignMessage(
								res.path(),
								encoding,
								(err, isDetached) => {
									if (err) {
										showToastDanger(err);
									} else {
										NativeModules.Wrap_Signer.getSignInfo(
											isDetached ? res.path().substring(0, res.path().length - 4) : "",
											res.path(),
											encoding,
											isDetached ? true : false,
											(err, verify) => {
												if (err) {
													showToastDanger(err);
												} else {
													if (verify.length === 1) {
														navigate("AboutSignCert", { cert: verify[0], isCryptoDoc: true });
													} else {
														navigate("AboutAllSignCert", { cert: verify, isCryptoDoc: true });
													}
												}
											}
										);
									}
								}
							)
						);

					});
				//
				break;
			case "sign":
				result = url.match(/\?id=.{1,}\?url/);
				id = result[0].slice(4, -4);
				result = url.match(/\?url=.{1,}\?filename/);
				getfileurl = result[0].slice(5, -9);
				result = url.match(/\?filename=.{1,}\?uploadurl/);
				getnamefile = result[0].slice(10, -10);
				result = url.match(/\?uploadurl=.{1,}\?command=upload/);
				uploadurl = result[0].slice(11, -15);
				RNFetchBlob
					.config({
						fileCache: true
					})
					.fetch("POST", getfileurl)
					.then((res) => {
						// the path should be dirs.DocumentDir + 'path-to-file.anything'
						console.log("The file saved to ", res.path());
						addTempFilesForCryptoarmdDocuments(decodeURI(getnamefile), +id, uploadurl, chrome);
						addFiles(res.path(), decodeURI(getnamefile), "sign");
						navigate("Signature", { name: "Signature" });
					});
				break;
			default: break;
		}
	}
}