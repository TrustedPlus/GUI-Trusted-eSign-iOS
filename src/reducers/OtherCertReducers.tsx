import { OTHER_CERT_ACTION} from "../constants";

const initialState = {
  title: null,
  img: null,
  note: null,
  issuerName: null,
  serialNumber: null,
  provider: null
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
        provider: action.payload[5]
      };
    default:
      return state;
  }
}