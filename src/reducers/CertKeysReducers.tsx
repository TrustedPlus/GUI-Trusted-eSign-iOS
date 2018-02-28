import { READ_CERT_KEY, READ_CERT_KEY_SUCCESS, READ_CERT_KEY_ERROR } from "../constants";

const initialState = {
  id: [],
  title: [],
  extension: [],
  note: []
};

export function CertKeys(state = initialState, action) {
  switch (action.type) {
    case READ_CERT_KEY:
      return {
        ...state
      };
    case READ_CERT_KEY_SUCCESS:
      let arrTitle = [], arrExtension = [], arrId = [], arrNote = [], arrPath = [];
      for (let i = 0; i < action.payload.length; i++) {
        if (action.payload[i].extension !== "key") {
          if (action.payload[i].name !== "") {
            arrTitle.push(action.payload[i].name);
            arrExtension.push(action.payload[i].extension);
            arrId.push(i);
          arrNote.push(action.payload[i].mtime);
          }
        }
      }
      return {
          ...state,
          title: arrTitle,
          extension: arrExtension,
          id: arrId,
          note: arrNote
        };
    case READ_CERT_KEY_ERROR:
      return {
        ...state
      };
    default:
      return state;
  }
}