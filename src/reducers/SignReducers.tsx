import { AnyAction } from "redux";
import { FOOTER_ACTION, FOOTER_CLOSE} from "../constants";

interface FooterReducerStore {
  arrButton: any[];
}

const initialState: FooterReducerStore = {
  arrButton: [] // массив выбраных файлов
};

function arrButtonFunc(oldButtonArray, idButton: number) {

  let index = oldButtonArray.indexOf(idButton);
  if (index !== -1) {
    oldButtonArray.splice(index, 1); // удаление из массива
    return oldButtonArray;
  }
  oldButtonArray.push(idButton);
  return oldButtonArray; // добавление в массив
}

export default function Footer(state = initialState, action: AnyAction): FooterReducerStore {
  switch (action.type) {
    case FOOTER_ACTION:
      return {
        ...state,
        arrButton: arrButtonFunc(state.arrButton, action.payload.idButton)
      };
    case FOOTER_CLOSE:
      return {
        ...state,
        arrButton: []
      };
    default:
      return state;
  }
}