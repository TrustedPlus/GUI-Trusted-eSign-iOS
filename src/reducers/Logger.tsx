import {
	ADD_FILES_SUCCESS, ADD_FILES_ERROR, SIGN_FILE_ERROR, SIGN_FILE_SUCCESS,
	VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, ENCODE_FILES_SUCCESS, ENCODE_FILES_ERROR,
	DECODE_FILES_SUCCESS, DECODE_FILES_ERROR, ADD_CERT_SUCCESS, ADD_CERT_ERROR, ADD_KEY_SUCCESS, ADD_KEY_ERROR,
	SET_PATH_TO_STOR_ERROR, PROVIDER_INIT_ERROR, READ_CERTIFICATES_ERROR, UPLOAD_FILES_SUCCESS, UPLOAD_FILES_ERROR,
	DELETE_FILES_SUCCESS, DELETE_FILES_ERROR, CLEAR_LOG, CREATE_CERTIFICATE_SUCCESS, DELETE_CERTIFICATE_SUCCESS,
	CREATE_REQUEST_SUCCESS
} from "../constants";

const initialState = {
	log: [],
	lastlog: null
};

function logAddrecord(oldLog, name, status: boolean, record: string, err) {
	let now = new Date().toString();
	oldLog.unshift({ status, record, name, now, err });
	return oldLog; // добавление в массив
}

export function Logger(state = initialState, action) {
	switch (action.type) {
		case CREATE_REQUEST_SUCCESS:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, true,  "Запрос на\nсертификат", action.err),
				lastlog: new Date().toString()
			};
		case SET_PATH_TO_STOR_ERROR:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, false, "Указание пути\nдо хранилища", action.err),
				lastlog: new Date().toString()
			};
		case UPLOAD_FILES_SUCCESS:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, true, "Отправка\nфайла", action.err),
				lastlog: new Date().toString()
			};
		case UPLOAD_FILES_ERROR:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, false, "Отправка\nфайла", action.err),
				lastlog: new Date().toString()
			};
		case DELETE_FILES_SUCCESS:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, true, "Удаление\nфайла", action.err),
				lastlog: new Date().toString()
			};
		case DELETE_FILES_ERROR:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, false, "Удаление\nфайла", action.err),
				lastlog: new Date().toString()
			};
		case PROVIDER_INIT_ERROR:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, false, "Инициализация\nпровайдера", action.err),
				lastlog: new Date().toString()
			};
		case READ_CERTIFICATES_ERROR:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, false, "Чтение ключа\nили сертификата", action.err),
				lastlog: new Date().toString()
			};
		case ADD_FILES_SUCCESS:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, true, "Добавление\nфайла", action.err),
				lastlog: new Date().toString()
			};
		case ADD_FILES_ERROR:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, false, "Добавление\nфайла", action.err),
				lastlog: new Date().toString()
			};
		case ADD_CERT_SUCCESS:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, true, "Установка\nсертификата", action.err),
				lastlog: new Date().toString()
			};
		case ADD_CERT_ERROR:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, false, "Установка\nсертификата", action.err),
				lastlog: new Date().toString()
			};
		case ADD_KEY_SUCCESS:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, true, "Добавление\nключа", action.err),
				lastlog: new Date().toString()
			};
		case ADD_KEY_ERROR:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, false, "Добавление\nключа", action.err),
				lastlog: new Date().toString()
			};
		case SIGN_FILE_ERROR:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, false, "Подпись", action.err),
				lastlog: new Date().toString()
			};
		case SIGN_FILE_SUCCESS:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, true, "Подпись", action.err),
				lastlog: new Date().toString()
			};
		case VERIFY_SIGN_SUCCESS:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, true, "Верификация\nподписи", action.err),
				lastlog: new Date().toString()
			};
		case VERIFY_SIGN_ERROR:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, false, "Верификация\nподписи", action.err),
				lastlog: new Date().toString()
			};
		case ENCODE_FILES_SUCCESS:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, true, "Шифрование", action.err),
				lastlog: new Date().toString()
			};
		case ENCODE_FILES_ERROR:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, false, "Шифрование", action.err),
				lastlog: new Date().toString()
			};
		case DECODE_FILES_SUCCESS:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, true, "Расшифрование", action.err),
				lastlog: new Date().toString()
			};
		case DECODE_FILES_ERROR:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, false, "Расшифрование", action.err),
				lastlog: new Date().toString()
			};
		case CREATE_CERTIFICATE_SUCCESS:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, true, "Создание\nсертификата", action.err),
				lastlog: new Date().toString()
			};
		case DELETE_CERTIFICATE_SUCCESS:
			return {
				...state,
				log: logAddrecord(state.log.concat(), action.payload, true, "Удаление\nсертификата", action.err),
				lastlog: new Date().toString()
			};
		case CLEAR_LOG:
			return {
				...state,
				log: [],
				lastlog: null
			};
		default:
			return state;
	}
}