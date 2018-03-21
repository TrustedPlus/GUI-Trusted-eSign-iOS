import { OTHER_CERT_ACTION} from "../constants";

const initialState = {
  title: "",
  img: "",
  note: "",
  issuerName: "",
  serialNumber: ""
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
        serialNumber: action.payload[4]
      };
    default:
      return state;
  }
}