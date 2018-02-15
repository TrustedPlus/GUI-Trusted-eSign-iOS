import { AnyAction } from "redux";
import { FOOTER_ACTION, FOOTER_CLOSE} from "../constants";

interface FooterReducerStore {
  arrButton: any[];
}

const initialState: FooterReducerStore = {
  arrButton: [] // массив выбраных файлов
};

function arrButtonFunc(oldButtonArray, action: AnyAction) {

  let index = oldButtonArray.indexOf(action.payload);
  if (index !== -1) {
    oldButtonArray.splice(index, 1); // удаление из массива
    return oldButtonArray;
  }
  oldButtonArray.unshift(action.payload);
  return oldButtonArray; // добавление в массив
}

export default function Footer(state = initialState, action: AnyAction): FooterReducerStore {
  switch (action.type) {
    case FOOTER_ACTION:
      return {
        ...state,
        arrButton: arrButtonFunc(state.arrButton, action)
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