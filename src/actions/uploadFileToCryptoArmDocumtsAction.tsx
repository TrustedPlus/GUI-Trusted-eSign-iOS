import { ADD_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS, CLEAR_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS } from "../constants";
import * as RNFS from "react-native-fs";

export function addTempFilesForCryptoarmdDocuments(arrFiles, uploadurl, browser, href, extra, footerMark) {
	return {
		type: ADD_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS,
		payload: { arrFiles, uploadurl, browser, href, extra, footerMark }
	};
}

export function clearTempFiles() {
	RNFS.unlink(RNFS.DocumentDirectoryPath + "/RNFetchBlob_tmp/");
	return {
		type: CLEAR_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS
	};
}