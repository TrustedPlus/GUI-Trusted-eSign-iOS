import { ADD_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS, CLEAR_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS } from "../constants";
import * as RNFS from "react-native-fs";

export function addTempFilesForCryptoarmdDocuments(arrFiles, uploadurl, browser, href, extra) {
	return {
		type: ADD_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS,
		payload: { arrFiles, uploadurl, browser, href, extra }
	};
}

export function clearTempFiles(tempFiles) {
	if (tempFiles.arrFiles !== null) {
		for (let i = 0; i < tempFiles.arrFiles.length; i++) {
			RNFS.unlink(RNFS.DocumentDirectoryPath + "/Files/" + tempFiles.arrFiles[i].filename);
		}
	}
	return {
		type: CLEAR_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS
	};
}