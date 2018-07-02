import { READ_REQUESTS, CREATE_REQUEST_SUCCESS } from "../constants";

import * as RNFS from "react-native-fs";
import { showToastDanger } from "../utils/toast";

export function readRequests() {
	return function action(dispatch) {
		RNFS.mkdir(RNFS.DocumentDirectoryPath + "/Requests").then(
			response => {
				const request = RNFS.readDir(RNFS.DocumentDirectoryPath + "/Requests");
				return request.then(
					response => {
						let requests = response;
						let arrRequests = [], point, name, date, month, year, time;
						let length = requests.length;
						for (let i = 0; i < length; i++) {
							point = requests[i].name.indexOf(".");
							name = requests[i].name.substring(0, point);
							date = requests[i].mtime.getDate();
							month = requests[i].mtime.getMonth();
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
							year = requests[i].mtime.getFullYear();
							time = requests[i].mtime.toLocaleTimeString();
							arrRequests[i] = { name, date, month, year, time };
						}
						dispatch({type: READ_REQUESTS, payload: arrRequests});
					},
					err => showToastDanger(err)
				);
			},
			err => showToastDanger(err)
		);
	};
}

export function createRequest(CN) {
	return function action(dispatch) {
		dispatch({type: CREATE_REQUEST_SUCCESS, payload: CN});
	};
}

export function deleteRequests(requests, selectedRequests) {
	return function action(dispatch) {
		// dispatch({ type: DELETE_FILES });
		for (let i = 0; i < selectedRequests.length; i++) {
			RNFS.unlink(RNFS.DocumentDirectoryPath + "/Requests/" + requests[selectedRequests[i]].name + ".csr")
				.then(() => {
					console.log("Успешно удалено");
					// dispatch({ type: DELETE_FILES_SUCCESS, payload: files[footer.arrButton[i]].name });
				})
				.catch((err) => {
					console.log("При удалении возникла ошибка");
					// dispatch({ type: DELETE_FILES_ERROR, payload: err });
				});
		}
		setTimeout(() => {
			dispatch(readRequests());
		}, 300);
	};
}