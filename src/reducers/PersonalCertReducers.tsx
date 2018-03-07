import { PERSONAL_CERT_ACTION} from "../constants";

const initialState = {
  title: "",
  img: "",
  note: "",
  extension: ""
};

export function personalCert (state = initialState, action) {
  switch (action.type) {
    case PERSONAL_CERT_ACTION:
      return {
        ...state,
        title: action.payload[0],
        img: action.payload[1],
        note: action.payload[2],
        extension: action.payload[3]
      };
    default:
      return state;
  }
}