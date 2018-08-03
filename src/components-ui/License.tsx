import * as React from "react";
import * as RNFS from "react-native-fs";
import { styles } from "../styles";
import { Headers } from "../components/Headers";
import { Container, Footer, Text, View, FooterTab, Content, Form, Item, Label, Input } from "native-base";
import { FooterButton } from "../components/FooterButton";
import { Image, RefreshControl, ScrollView } from "react-native";
import { showToast } from "../utils/toast";

interface LicenseProps {
	navigation: any;
	goBack: void;
}

interface LicenseState {
	keylicenseApp: string;
	keylicenseCryptoPro: string;
}

export class License extends React.Component<LicenseProps, LicenseState> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);

		this.state = {
			keylicenseApp: "",
			keylicenseCryptoPro: ""
		};
	}

	saveLicense() {
		let pathKeylicenseApp = RNFS.DocumentDirectoryPath + "/license_app.txt";
		let pathkeylicenseCryptoPro = RNFS.DocumentDirectoryPath + "/license_cryptoPro.txt";
		RNFS.writeFile(pathKeylicenseApp, this.state.keylicenseApp, "utf8")
			.then(
				() => {
					console.log("Ключ для приложения создан!");
					RNFS.writeFile(pathkeylicenseCryptoPro, this.state.keylicenseCryptoPro, "utf8")
						.then(
							() => {
								console.log("Ключ для CryptoPro CSP создан!");
								showToast("Ключи были успешно созданы");
								this.props.navigation.goBack();
							}
						);
				}
			);
	}

	readLicense() {
		let pathKeylicenseApp = RNFS.DocumentDirectoryPath + "/license_app.txt";
		let pathkeylicenseCryptoPro = RNFS.DocumentDirectoryPath + "/license_cryptoPro.txt";
		if (RNFS.exists(pathKeylicenseApp)) {
			RNFS.readFile(pathKeylicenseApp, "utf8").then(
				(keylicense) => {
					this.setState({ keylicenseApp: keylicense});
				}
			);
		}
		if (RNFS.exists(pathkeylicenseCryptoPro)) {
			RNFS.readFile(pathkeylicenseCryptoPro, "utf8").then(
				(keylicense) => {
					this.setState({ keylicenseCryptoPro: keylicense});
				}
			);
		}
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		return (
			<Container style={styles.container}>
				<Headers title="Лицензии" goBack={() => goBack()} />
				<Content style={{ backgroundColor: "white" }}>
					<View>
						<Image style={styles.prop_cert_img} source={require("../../imgs/general/splash_icon.png")} />
						<Text style={styles.prop_cert_title}>КриптоАРМ ГОСТ</Text>
						<Text style={styles.prop_cert_status}>версия 1.0.0</Text>
					</View>
					<Form>
						<Item stackedLabel>
							<Label>Лицензия на приложение</Label>
							<Input
								placeholder={"Введите ключ лицензии"}
								placeholderTextColor={"lightgrey"}
								value={this.state.keylicenseApp}
								onChangeText={(keylicense) => this.setState({ keylicenseApp: keylicense })} />
						</Item>
					</Form>
					<Form>
						<Item stackedLabel>
							<Label>Лицензия на КриптоПРО CSP</Label>
							<Input
								placeholder={"Введите ключ лицензии"}
								placeholderTextColor={"lightgrey"}
								value={this.state.keylicenseCryptoPro}
								onChangeText={(keylicense) => this.setState({ keylicenseCryptoPro: keylicense })} />
						</Item>
					</Form>
				</Content>
				<Footer>
					<FooterTab>
						<FooterButton title="Сохранить" icon="md-download" nav={() => this.saveLicense()} />
					</FooterTab>
				</Footer>
			</Container>
		);
	}

	componentDidMount() {
		this.readLicense();
	}
}