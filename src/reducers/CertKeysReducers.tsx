import { READ_CERT_KEY, READ_PERSONAL_CERT_KEY_SUCCESS, READ_OTHER_CERT_KEY_SUCCESS } from "../constants";

export interface Certificate {

}

interface CertKeysStore {
  pesronalCertKeys: Certificate[];
  otherCertKeys: Certificate[];
}

const initialState: CertKeysStore = {
  pesronalCertKeys: [],
  otherCertKeys: []
};

export function CertKeys(state: CertKeysStore = initialState, action): CertKeysStore {
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