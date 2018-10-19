import { ADD_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS, CLEAR_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS } from "../constants";
import * as RNFS from "react-native-fs";

export function addTempFilesForCryptoarmdDocuments(name, id, uploadurl, browser) {
	return {
		type: ADD_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS,
		payload: { name, id, uploadurl, browser }
	};
}

export function clearTempFiles(tempFiles) {
	RNFS.unlink(RNFS.DocumentDirectoryPath + "/Files/" + tempFiles[0].name);
	return {
		type: CLEAR_TEMP_FILES_FOR_CRYPTOARMDOCUMENTS
	};
}