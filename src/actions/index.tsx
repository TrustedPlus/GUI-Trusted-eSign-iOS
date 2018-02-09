import { FOOTER_OPEN, FOOTER_CLOSE } from "../constants";

export function getFooterOpen() {
  return {
    type: FOOTER_OPEN
  };
}

export function getFooterClose() {
  return {
    type: FOOTER_CLOSE
  };
}