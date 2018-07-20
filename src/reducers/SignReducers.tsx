/*import { AnyAction } from "redux";
import { FOOTER_ACTION, FOOTER_CLOSE } from "../constants";

const initialState = {
	arrButton: [], // массив выбраных файлов
	arrExtension: []
};

function footer_action(oldState, payload: { idButton: number, extension: string }) {

	let index = oldState.arrButton.indexOf(payload.idButton);
	if (index !== -1) {
		oldState.arrButton.splice(index, 1); // удаление из массива
		oldState.arrExtension.splice(index, 1);
		return oldState;
	}
	oldState.arrButton.push(payload.idButton);
	oldState.arrExtension.push(payload.extension);
	return oldState; // добавление в массив
}

export function Footer(state = initialState, action: AnyAction) {
	switch (action.type) {
		case FOOTER_ACTION:
			let newState = footer_action(state, action.payload);
			return {
				...state,
				arrButton: newState.arrButton,
				arrExtension: newState.arrExtension
			};
		case FOOTER_CLOSE:
			return {
				...state,
				arrButton: [],
				arrExtension: []
			};
		default:
			return state;
	}
} */