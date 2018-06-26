import { Toast } from "native-base";

export function showToast(msg: string) {
	Toast.show({
		text: msg,
		position: "bottom",
		duration: 1500
	});
}

export function showToastDanger(msg: string) {
	Toast.show({
		text: msg,
		position: "bottom",
		buttonText: "Закрыть",
		buttonTextStyle: { color: "white" },
		duration: 150000
	});
}