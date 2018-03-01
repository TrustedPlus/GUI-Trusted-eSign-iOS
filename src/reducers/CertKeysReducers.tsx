import { READ_CERT_KEY, READ_CERT_KEY_SUCCESS, READ_CERT_KEY_ERROR } from "../constants";

const initialState = {
  certKeys: []
};

export function CertKeys(state = initialState, action) {
  switch (action.type) {
    case READ_CERT_KEY:
      return {
        ...state
      };
    case READ_CERT_KEY_SUCCESS:
      return {
          ...state,
          certKeys: action.payload
        };
    case READ_CERT_KEY_ERROR:
      return {
        ...state
      };
    default:
      return state;
  }
}