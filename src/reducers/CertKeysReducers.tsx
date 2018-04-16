import { READ_CERT_KEY, READ_PERSONAL_CERT_KEY_SUCCESS, READ_OTHER_CERT_KEY_SUCCESS } from "../constants";

const initialState = {
  pesronalCertKeys: [],
  otherCertKeys: []
};

export function CertKeys(state = initialState, action) {
  switch (action.type) {
    case READ_CERT_KEY:
      return {
        ...state
      };
    case READ_PERSONAL_CERT_KEY_SUCCESS:
      return {
          ...state,
          pesronalCertKeys: action.payload
        };
    case READ_OTHER_CERT_KEY_SUCCESS:
      return {
          ...state,
          otherCertKeys: action.payload
        };
    default:
      return state;
  }
}