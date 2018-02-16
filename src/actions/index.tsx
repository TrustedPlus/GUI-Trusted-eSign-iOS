import { FOOTER_ACTION, FOOTER_CLOSE, CERT_ACTION, SIGN_FILES, ENCRYPT_FILES } from "../constants";

export function footerAction(idButton) {
  return {
    type: FOOTER_ACTION,
    payload: idButton
  };
}

export function footerClose() {
  return {
    type: FOOTER_CLOSE
  };
}

export function certAdd(title, img, note) {
  return {
    type: CERT_ACTION,
    payload: [title, img, note]
  };
}

export function signFiles(id) {
  return {
    type: SIGN_FILES,
    payload: id
  };
}

export function encryptFiles(id) {
  return {
    type: ENCRYPT_FILES,
    payload: id
  };
}