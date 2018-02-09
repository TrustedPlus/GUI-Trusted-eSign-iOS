import { FOOTER_OPEN, FOOTER_CLOSE } from "../constants";
const initialState = {
  footer: false
};

export default function dataReducer (state = initialState, action) {
  switch (action.type) {
    case FOOTER_OPEN:
      return {
        ...state,
        footer: true
      };
    case FOOTER_CLOSE:
      return {
        ...state,
        footer: false
      };
    default:
      return state;
  }
}