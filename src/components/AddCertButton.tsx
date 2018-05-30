import * as React from "react";
import { Button } from "native-base";
import { AlertIOS, Image } from "react-native";
import { DocumentPicker } from "react-native-document-picker";

interface AddCertButtonProps {
	navigate: any;
	addCertFunc: Function;
}

export class AddCertButton extends React.Component<AddCertButtonProps> {

	documentPicker() {
		DocumentPicker.show({
			filetype: ["public.item"]
		}, (error: any, res: any) => {
			let point, name, extension;
			point = res.fileName.indexOf(".");
			extension = res.fileName.substring(point + 1);
			if (extension === "pfx") {
				AlertIOS.prompt(
					"Введите пароль для сертификата",
					null,
					[
						{
							text: "Отмена",
							onPress: () => null,
							style: "cancel",
						},
						{
							text: "Ввести",
							onPress: (password) => this.props.addCertFunc(res.uri, res.fileName, password),
						},
					],
					"secure-text"
				);
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
					{ text: "Импортировать сертификат", onPress: () => this.documentPicker() },
					{ text: "Создать самоподписаный сертификат", onPress: () => this.props.navigate("CreateCertificate") },
					{ text: "Отмена", onPress: () => null, style: "cancel" }
				]
			);
		}}>
			<Image style={{ width: 60, height: 60 }} source={require("../../imgs/general/add_icon.png")} />
		</Button>
		);
	}
}