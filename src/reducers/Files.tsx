import { SIGN_FILES} from "../constants";

const initialState = {
    id: [0, 1, 2, 3],
    title: ["Договор №2332", "Письмо от 23.08.2018", "Договор №2332 с приложениями", "Заключение от поставке"],
    extension: ["pdf", "txt", "zip", "docx"],
    note: ["12 января 2018, 02:34:22", "12 января 2018, 02:36:38", "6 января 2018, 13:49:26", "6 января 2018, 14:28:18"]
};

function changeExtension(OldExtension, id) {
    let length = id.length;
    while (length) {
        OldExtension[id[length]] = "sig";
        length--;
        console.log(length);
    }
    OldExtension[id[0]] = "sig";
    return OldExtension;
}

export function Files (state = initialState, action) {
  switch (action.type) {
    case SIGN_FILES:
      return {
        ...state,
        extension: changeExtension(state.extension, action.payload)
      };
    default:
      return state;
  }
}