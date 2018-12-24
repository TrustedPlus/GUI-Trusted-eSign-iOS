import { CREATE_SERVICE, SELECTED_SERVICE, CONNECT_TO_SERVICE, TAKE_CERTIFICATE_FROM_SERVICE, ADD_TRANSACTION_ID } from "../constants";
import { bufferToHexCodes } from "pvutils";

const initialState = {
	services: [],
	lengthServices: 0,
	lastid: 0,
	certificate: []
};

function selectedServices(services, key) {
	services.forEach(
		(service, i) => {
			if (service.key === key) {
				services[i].isSelected = !services[i].isSelected;
				return services;
			}
		}
	);
	return services;
}

function changedLength(oldLengthServices, services, key) {
	services.forEach(
		(service, i) => {
			if (service.key === key) {
				if (services[i].isSelected) {
					oldLengthServices++;
				} else {
					oldLengthServices--;
				}
			}
		}
	);

	return oldLengthServices;
}

function connectedServices(services, payload) {
	services[payload.key - 1].status = payload.status;
	return services;
}

function typesAndValuesToString(typesAndValues) {
	let stringName = "";
	typesAndValues.map(
		(value) => {
			stringName += "/" + value.type + "=" + value.value.valueBlock.value;
		}
	);
	return stringName;
}

function takeParam(param, typesAndValues) {
	for (let value of typesAndValues) {
		if (param === value.type) {
			return value.value.valueBlock.value;
		}
	}
}

function signatureAlgorithm(algorithmId) {
	switch (algorithmId) {
		case "1.2.643.2.2.3":
			return "ГОСТ Р 34.10-2001";
		case "1.2.643.7.1.1.3.2":
			return "ГОСТ Р 34.10-2012 для ключей длины 256 бит";
		case "1.2.643.7.1.1.3.3":
			return "ГОСТ Р 34.10-2012 для ключей длины 512 бит";
		default:
			return "Неизвестный алгоритм";
	}
}

function addTransactionId(services, payload) {
	services[payload.key - 1].transaction_id = payload.transaction_id;
	return services;
}

function parseCert(payload) {
	let certificate = payload.certificate;
	console.log(certificate);
	const cert = {
		category: "MY",
		chainBuilding: 1,
		hasPrivateKey: 1,
		isCA: false,
		issuerFriendlyName: takeParam("2.5.4.3", certificate.issuer.typesAndValues),
		issuerName: typesAndValuesToString(certificate.issuer.typesAndValues),
		subjectName: typesAndValuesToString(certificate.subject.typesAndValues),
		selfSigned: false,
		keyUsage: "null",
		notAfter: certificate.notAfter.value + "",
		notBefore: certificate.notBefore.value + "",
		organizationName: takeParam("2.5.4.10", certificate.subject.typesAndValues),
		provider: "null",
		publicKeyAlgorithm: "null",
		serialNumber: bufferToHexCodes(certificate.serialNumber.valueBlock._valueHex),
		signatureAlgorithm: signatureAlgorithm(certificate.signatureAlgorithm.algorithmId),
		signatureDigestAlgorithm: "null",
		subjectFriendlyName: takeParam("2.5.4.3", certificate.subject.typesAndValues),
		type: "null",
		version: "null",
		transaction_id: payload.transaction_id
	};
	if (cert.issuerName === cert.subjectName) {
		cert.selfSigned = true;
	}
	return cert;
}

export function services(state = initialState, action) {
	switch (action.type) {
		case CREATE_SERVICE:
			return {
				...state,
				services: [
					...state.services,
					{
						name: action.payload,
						status: "не подключен",
						operator: "Мегафон МЭП",
						isSelected: false,
						transaction_id: null,			// status: 0 - не подключен
						key: state.lastid + 1			// 1 - подключение
					}											// 2 - подключен
				],												// 3 - ошибка при подключении
				lastid: ++state.lastid
			};
		case SELECTED_SERVICE:
			return {
				...state,
				services: selectedServices(state.services.concat(), action.payload),
				lengthServices: changedLength(state.lengthServices, state.services.concat(), action.payload)
			};
		case CONNECT_TO_SERVICE:
			return {
				...state,
				services: connectedServices(state.services.concat(), action.payload),
			};
		case TAKE_CERTIFICATE_FROM_SERVICE:
			return {
				...state,
				certificate: parseCert(action.payload),
			};
		case ADD_TRANSACTION_ID:
			return {
				...state,
				services: addTransactionId(state.services.concat(), action.payload),
			};
		default:
			return state;
	}
}
