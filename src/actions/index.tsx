import { FOOTER_ACTION, FOOTER_CLEAR } from "../constants";

export function footerAction(idButton) {
  return {
    type: FOOTER_ACTION,
    payload: idButton
  };
}

export function footerClear() {
  return {
    type: FOOTER_CLEAR
  };
}