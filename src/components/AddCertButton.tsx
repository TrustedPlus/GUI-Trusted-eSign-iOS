import * as React from "react";
import { Button } from "native-base";
import { AlertIOS, Image } from "react-native";
import { DocumentPicker } from "react-native-document-picker";

interface AddCertButtonProps {
	navigate: any;
	addCertFunc: Function;
}

interface AddCertButtonState {
	numInvalidPassword: number;
}

export class AddCertButton extends React.Component<AddCertButtonProps, AddCertButtonState> {

	constructor(props) {
		super(props);
		this.state = {
			numInvalidPassword: 0
		};
	}

	Prompt(res) {
		AlertIOS.prompt(
			this.state.numInvalidPassword ? "Ошибка, введите корректный пароль" : "Введите пароль для сертификата",
			null,
			[
				{
					text: "Отмена",
					onPress: () => null,
					style: "cancel",
				},
				{
					text: "Ввести",
					onPress: (password) => this.props.addCertFunc(res.uri, res.fileName, password, (err) => {
						let index = err.indexOf("Action canceled by user!");
						if (index === -1) {
							this.setState({ numInvalidPassword: this.state.numInvalidPassword + 1 });
							this.state.numInvalidPassword < 3 ? this.Prompt(res) : AlertIOS.alert("Вы превысили максимальное число попыток");
						} else {
							setTimeout(() => AlertIOS.alert("Добавление было отменено"), 400);
						}
					}),
				},
			],
			"secure-text"
		);
	}

	documentPicker() {
		DocumentPicker.show({
			filetype: ["public.item"]
		}, (error: any, res: any) => {
			let point, name, extension;
			point = res.fileName.indexOf(".");
			extension = res.fileName.substring(point + 1);
			if (extension === "pfx") {
				this.Prompt(res);
			} else {
				this.props.addCertFunc(res.uri, res.fileName, null);
			}
		});
	}

	render() {
		return (<Button transparent style={{ position: "absolute", bottom: 40, right: 30 }} onPress={() => {
			AlertIOS.alert(
				"Добавление сертификата",
				null,
				[
					{ text: "Импорт", onPress: () => {this.documentPicker(); this.setState({numInvalidPassword: 0}); }},
					{ text: "Создание", onPress: () => this.props.navigate("CreateCertificate") },
					{ text: "Отмена", onPress: () => null, style: "destructive" }
				]
			);
		}}>
			<Image style={{ width: 60, height: 60 }} source={require("../../imgs/general/add_icon.png")} />
		</Button>
		);
	}
}