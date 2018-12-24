import { CREATE_SERVICE, SELECTED_SERVICE, CONNECT_TO_SERVICE, TAKE_CERTIFICATE_FROM_SERVICE, ADD_TRANSACTION_ID } from "../constants";
import * as soap from "soap-everywhere";
import * as asn1js from "asn1js";
import * as pkijs from "pkijs";
import { stringToArrayBuffer, fromBase64 } from "pvutils";

export function createService(nameService) {
	return function action(dispatch) {
		dispatch({ type: CREATE_SERVICE, payload: nameService });
	};
}

export function selectedService(key) {
	return function action(dispatch) {
		dispatch({ type: SELECTED_SERVICE, payload: key });
	};
}

export function connectToCervices(transaction_id, key, phone_number) {
	return function action(dispatch) {
		let url = "https://msign.megafon.ru/mes-ws/status?wsdl";
		let args = {
			partner_id: "digt",
			transaction_id
		};
		let timerId = setInterval(() => {
			soap.createClient(url, (err, client) => {
				client.getAuthStatus(args, (err, result) => {
					console.log(result);
					if (result.status === "100") {
						clearInterval(timerId);
						const asn1 = asn1js.fromBER(stringToArrayBuffer(fromBase64(result.certificate)));
						const certificate = new pkijs.Certificate({ schema: asn1.result });
						dispatch({ type: TAKE_CERTIFICATE_FROM_SERVICE, payload: { certificate, phone_number, transaction_id } });
					}
					switch (result.status) {
						case "100":
							dispatch({ type: CONNECT_TO_SERVICE, payload: { status: "подключено", key } });
							break;
						case "101":
							dispatch({ type: CONNECT_TO_SERVICE, payload: { status: "подключение", key } });
							break;
						default:
							dispatch({ type: CONNECT_TO_SERVICE, payload: { status: result.status, key } });
					}
				});
			});
		}, 10000);
	};
}