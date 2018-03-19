import { READ_FILES, READ_FILES_SUCCESS, READ_FILES_ERROR, ADD_FILES,
         SIGN_FILE, SIGN_FILE_ERROR, SIGN_FILE_SUCCESS, SIGN_FILE_END,
         VERIFY_SIGN, VERIFY_SIGN_SUCCESS, VERIFY_SIGN_ERROR, VERIFY_SIGN_END,
         ENCODE_FILES, ENCODE_FILES_SUCCESS, ENCODE_FILES_ERROR, ENCODE_FILES_END,
         DECODE_FILES, DECODE_FILES_SUCCESS, DECODE_FILES_ERROR, DECODE_FILES_END,
         CLEAR_LOG} from "../constants";

const initialState = {
  files: [],
  isFetching: false,
  log: [],
  lastlog: ""
};

function verySignSuccess(oldFiles, action) {
  for (let i = 0; i < oldFiles.length; i++) {
    if ((oldFiles[i].name === action.payload) && (oldFiles[i].extension === "sig")) {
      oldFiles[i].verify = 1;
      return oldFiles;
    }
  }
}

function verySignError(oldFiles, action) {
  if (action.payload === 0) return oldFiles;
  for (let i = 0; i < oldFiles.length; i++) {
    if ((oldFiles[i].name === action.payload) && (oldFiles[i].extension === "sig")) {
      oldFiles[i].verify = -1;
      return oldFiles;
    }
  }
}

function logAddrecord(oldLog, name, record: string) {
  let now = new Date();
  oldLog.push(record + "\n" + name + "\n" + now + "\n");
  return oldLog; // добавление в массив
}

export function Files(state = initialState, action) {
  switch (action.type) {
    case READ_FILES:
      return {
        ...state,
        isFetching: true
      };
    case READ_FILES_SUCCESS:
      return {
          ...state,
          files: action.payload,
          isFetching: false
        };
    case READ_FILES_ERROR:
      return {
        ...state
      };
    case ADD_FILES:
      return {
        ...state,
        log: logAddrecord(state.log, action.payload, "Добавление файла"),
        lastlog: new Date() + ""
      };
    case SIGN_FILE:
      return {
        ...state,
        isFetching: true
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
        log: logAddrecord(state.log,  action.payload, "Подпись файла прошла успешно"),
        lastlog: new Date() + ""
      };
    case SIGN_FILE_END:
      return {
        ...state,
        isFetching: false
      };
    case VERIFY_SIGN:
      return {
        ...state,
        isFetching: true
      };
    case VERIFY_SIGN_SUCCESS:
      return {
        ...state,
        files: verySignSuccess(state.files, action),
        log: logAddrecord(state.log, action.payload, "Верификация подписи прошла успешно"),
        lastlog: new Date() + ""
      };
    case VERIFY_SIGN_ERROR:
      return {
        ...state,
        files: verySignError(state.files, action),
        log: logAddrecord(state.log, action.payload, "Подпись не верифицирована"),
        lastlog: new Date() + ""
      };
    case VERIFY_SIGN_END:
      return {
        ...state,
        isFetching: false
      };
    case ENCODE_FILES:
      return {
        ...state,
        isFetching: true
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
    case ENCODE_FILES_END:
      return {
        ...state,
        isFetching: false
      };
    case DECODE_FILES:
      return {
        ...state,
        isFetching: true
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
    case DECODE_FILES_END:
      return {
        ...state,
        isFetching: false
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