import { OTHER_CERT_ACTION, OTHER_CERT_CLEAR } from "../constants";

const initialState = {
  title: null,
  img: null,
  note: null,
  issuerName: null,
  serialNumber: null,
  provider: null,
  category: null
};

export function otherCert (state = initialState, action) {
  switch (action.type) {
    case OTHER_CERT_ACTION:
      return {
        ...state,
        title: action.payload[0],
        img: action.payload[1],
        note: action.payload[2],
        issuerName: action.payload[3],
        serialNumber: action.payload[4],
        provider: action.payload[5],
        category: action.payload[6]
      };
      case OTHER_CERT_CLEAR:
      return {
        ...state,
        title: null,
        img: null,
        note: null,
        issuerName: null,
        serialNumber: null,
        provider: null,
        category: null
      };
    default:
      return state;
  }
}