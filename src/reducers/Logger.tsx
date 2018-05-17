import {
    ADD_FILES_SUCCESS, ADD_FILES_ERROR, SIGN_FILE_ERROR, SIGN_FILE_SUCCESS,
    VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, ENCODE_FILES_SUCCESS, ENCODE_FILES_ERROR,
    DECODE_FILES_SUCCESS, DECODE_FILES_ERROR, ADD_CERT_SUCCESS, ADD_CERT_ERROR, ADD_KEY_SUCCESS, ADD_KEY_ERROR,
    SET_PATH_TO_STOR_ERROR, PROVIDER_INIT_ERROR, READ_CERTIFICATES_ERROR, UPLOAD_FILES_SUCCESS, UPLOAD_FILES_ERROR,
    DELETE_FILES_SUCCESS, DELETE_FILES_ERROR, CLEAR_LOG, CREATE_CERTIFICATE_SUCCESS
} from "../constants";

const initialState = {
    log: [],
    lastlog: ""
};


function logAddrecord(oldLog, name, record: string) {
    let now = new Date();
    oldLog.push(record + "\n" + name + "\n" + now + "\n");
    return oldLog; // добавление в массив
}

export function Logger(state = initialState, action) {
    switch (action.type) {
        case SET_PATH_TO_STOR_ERROR:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Указание пути до хранилища не увенчалось успехом"),
                lastlog: new Date() + ""
            };
        case UPLOAD_FILES_SUCCESS:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Успешная отправка файла"),
                lastlog: new Date() + ""
            };
        case UPLOAD_FILES_ERROR:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Отправка файла не удалась"),
                lastlog: new Date() + ""
            };
        case DELETE_FILES_SUCCESS:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Успешное удаление файла"),
                lastlog: new Date() + ""
            };
        case DELETE_FILES_ERROR:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Удаление файла не удалось"),
                lastlog: new Date() + ""
            };
        case PROVIDER_INIT_ERROR:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Инициализация провайдера не увенчалась успехом"),
                lastlog: new Date() + ""
            };
        case READ_CERTIFICATES_ERROR:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Ошибка чтения ключа или сертификата"),
                lastlog: new Date() + ""
            };
        case ADD_FILES_SUCCESS:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Добавление файла"),
                lastlog: new Date() + ""
            };
        case ADD_FILES_ERROR:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Добавление файла не удалось"),
                lastlog: new Date() + ""
            };
        case ADD_CERT_SUCCESS:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Добавление сертификата"),
                lastlog: new Date() + ""
            };
        case ADD_CERT_ERROR:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Добавление сертификата не удалось"),
                lastlog: new Date() + ""
            };
        case ADD_KEY_SUCCESS:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Добавление ключа"),
                lastlog: new Date() + ""
            };
        case ADD_KEY_ERROR:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Добавление ключа не удалось"),
                lastlog: new Date() + ""
            };
        case SIGN_FILE_ERROR:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Подпись файла не удалась"),
                lastlog: new Date() + ""
            };
        case SIGN_FILE_SUCCESS:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Подпись файла прошла успешно"),
                lastlog: new Date() + ""
            };
        case VERIFY_SIGN_SUCCESS:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Верификация подписи прошла успешно"),
                lastlog: new Date() + ""
            };
        case VERIFY_SIGN_ERROR:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Подпись не верифицирована"),
                lastlog: new Date() + ""
            };
        case ENCODE_FILES_SUCCESS:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Шифрование файла прошло успешно"),
                lastlog: new Date() + ""
            };
        case ENCODE_FILES_ERROR:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Шифрование файла не удалось"),
                lastlog: new Date() + ""
            };
        case DECODE_FILES_SUCCESS:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Расшифрование файла прошло успешно"),
                lastlog: new Date() + ""
            };
        case DECODE_FILES_ERROR:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Расшифрование файла не удалось"),
                lastlog: new Date() + ""
            };
        case CREATE_CERTIFICATE_SUCCESS:
            return {
                ...state,
                log: logAddrecord(state.log, action.payload, "Сертификат был успешно создан"),
                lastlog: new Date() + ""
            };
        case CLEAR_LOG:
            return {
                ...state,
                log: [],
                lastlog: ""
            };
        default:
            return state;
    }
}