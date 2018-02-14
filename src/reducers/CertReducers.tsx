import { CERT_ACTION} from "../constants";

const initialState = {
  title: "",
  img: "",
  note: ""
};

export function Certificate (state = initialState, action) {
  switch (action.type) {
    case CERT_ACTION:
      return {
        ...state,
        title: action.payload[0],
        img: action.payload[1],
        note: action.payload[2]
      };
    default:
      return state;
  }
}