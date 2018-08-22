import * as React from "react";
import { AlertIOS, Image } from "react-native";
import { DocumentPicker } from "react-native-document-picker";
import * as Modal from "react-native-modalbox";
import { Footer, FooterTab, Text, View, ListItem, Header, Title, Button, List, Left, Right, Icon } from "native-base";
import { styles } from "../styles";

interface AddCertButtonProps {
	navigate: any;
	addCertFunc: Function;
}

interface AddCertButtonState {
	numInvalidPassword: number;
}

interface IModals {
	basicModal: Modal.default;
}

export class AddCertButton extends React.Component<AddCertButtonProps, AddCertButtonState> {

	constructor(props) {
		super(props);
		this.state = {
			numInvalidPassword: 0
		};
	}

	private modals: IModals = {
		basicModal: null
	};

	Prompt(res) {
		AlertIOS.prompt(
			this.state.numInvalidPassword ? "Ошибка, введите корректный пароль" : "Введите пароль для сертификата",
			null,
			[{
				text: "Отмена",
				onPress: () => null,
				style: "cancel",
			},
			{
				text: "Ввести",
				onPress: (password) => this.props.addCertFunc(res.uri, res.fileName, password, (err) => {
					let index = err.indexOf("Action canceled by user!");
					if (index === -1) {
						index = err.indexOf("Can't open license");
						if (index === -1) {
							this.setState({ numInvalidPassword: this.state.numInvalidPassword + 1 });
							this.state.numInvalidPassword < 3 ? this.Prompt(res) : AlertIOS.alert("Вы превысили максимальное число попыток");
						} else {
							setTimeout(() => AlertIOS.alert("Ваша приложение не активно. Введите корректную лицензию"), 400);
						}
					} else {
						setTimeout(() => AlertIOS.alert("Добавление было отменено"), 400);
					}
				}),
			}],
			"secure-text"
		);
	}

	documentPicker() {
		DocumentPicker.show({
			filetype: ["public.item"]
		}, (error: any, res: any) => {
			let point, extension;
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
		return (<>
			<Button transparent style={{ position: "absolute", bottom: 40, right: 30 }} onPress={() => this.modals.basicModal.open()}>
				<Image style={{ width: 60, height: 60 }} source={require("../../imgs/general/add_icon.png")} />
			</Button>
			<Modal
				ref={ref => this.modals.basicModal = ref}
				style={[styles.modal, {
					height: "auto",
					width: 300,
					backgroundColor: "white",
				}]}
				position={"center"}
				swipeToClose={false}>
				<View style={{ width: "100%" }}>
					<Header
						style={{ backgroundColor: "#be3817", height: 45.7, paddingTop: 13 }}>
						<Title>
							<Text style={{
								color: "white",
								fontSize: 15
							}}>Добавление сертификата</Text>
						</Title>
					</Header>
					<View>
						<List>
							<ListItem last style={{ marginLeft: 0, paddingLeft: 17 }} onPress={() => { this.documentPicker(); this.setState({ numInvalidPassword: 0 }); this.modals.basicModal.close(); }}>
								<Left>
									<Text style={{ fontSize: 13, color: "grey" }}>Импортировать сертификат</Text>
								</Left>
								<Right>
									<Icon name="ios-arrow-forward-outline"></Icon>
								</Right>
							</ListItem>
							<ListItem last style={{ marginLeft: 0, paddingLeft: 17 }} onPress={() => {this.props.navigate("CreateCertificate"); this.modals.basicModal.close(); }} >
								<Left>
									<Text style={{ fontSize: 13, color: "grey" }}>Создать запрос на сертификат</Text>
								</Left>
								<Right>
									<Icon name="ios-arrow-forward-outline"></Icon>
								</Right>
							</ListItem>
							<ListItem onPress={() => this.modals.basicModal.close()}>
								<Text style={{ fontSize: 15, width: "100%", height: "100%", textAlign: "center", color: "grey" }}>Отмена</Text>
							</ListItem>
						</List>
					</View>
				</View>
			</Modal>
		</>
		);
	}
}