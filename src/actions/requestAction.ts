import { READ_REQUESTS, CREATE_REQUEST_SUCCESS, SELECTED_REQUEST, CLEAR_REQUESTS } from "../constants";

import * as RNFS from "react-native-fs";
import { showToastDanger } from "../utils/toast";

export function readRequests() {
	return function action(dispatch) {
		RNFS.mkdir(RNFS.DocumentDirectoryPath + "/Requests").then(
			response => {
				const request = RNFS.readDir(RNFS.DocumentDirectoryPath + "/Requests");
				return request.then(
					response => {
						dispatch(clearRequests());
						let requests = response;
						let arrRequests = [], point, name, isSelected = false;
						let length = requests.length;
						for (let i = 0; i < length; i++) {
							point = requests[i].name.indexOf(".");
							name = requests[i].name.substring(0, point);
							arrRequests[i] = { name, time: requests[i].mtime, isSelected };
						}
						dispatch({ type: READ_REQUESTS, payload: arrRequests });
					},
					err => showToastDanger(err)
				);
			},
			err => showToastDanger(err)
		);
	};
}

export function clearRequests() {
	return function action(dispatch) {
		dispatch({ type: CLEAR_REQUESTS });
	};
}

export function selectedRequest(key) {
	return function action(dispatch) {
		dispatch({ type: SELECTED_REQUEST, payload: key });
	};
}

export function createRequest(CN) {
	return function action(dispatch) {
		dispatch({ type: CREATE_REQUEST_SUCCESS, payload: CN });
	};
}

export function deleteRequests(requests) {
	return function action(dispatch) {
		// dispatch({ type: DELETE_FILES });
		requests.forEach((request, i, arr) => {
			if (request.isSelected) {
				RNFS.unlink(RNFS.DocumentDirectoryPath + "/Requests/" + request.name + ".csr")
					.then(() => {
						console.log("Успешно удалено");
						// dispatch({ type: DELETE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name });
					})
					.catch((err) => {
						console.log("При удалении возникла ошибка");
						// dispatch({ type: DELETE_FILES_ERROR, payload: err });
					});
			}
		});
		setTimeout(() => {
			dispatch(readRequests());
		}, 300);
	};
}