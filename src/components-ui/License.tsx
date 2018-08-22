import * as React from "react";
import { styles } from "../styles";
import { Headers } from "../components/Headers";
import { Container, Footer, Text, View, FooterTab, Content, Form, Item, Label, Input } from "native-base";
import { FooterButton } from "../components/FooterButton";
import { Image, NativeModules, Alert, AlertIOS } from "react-native";
import { showToast, showToastDanger } from "../utils/toast";

interface LicenseProps {
	navigation: any;
	goBack: void;
}

interface LicenseState {
	keylicenseApp: string;
	keylicenseCryptoPro: string;
	CSPVersion: string;
	CSPCoreVersion: string;
	validityTimeOfLicense: number;
	validityCSPLicense: string;
}

const options = {
	year: "numeric", month: "long", day: "numeric",
	hour: "numeric", minute: "numeric", second: "numeric"
};

export class License extends React.Component<LicenseProps, LicenseState> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);

		this.state = {
			keylicenseApp: "", // CIMVH-DFXTC-VDXXQ-XJWRV-AWKTJ-VTWXJ-FKCAP
			keylicenseCryptoPro: "", // 40400-T0000-02WUR-TMDMX-50L66
			CSPVersion: null,
			CSPCoreVersion: null,
			validityTimeOfLicense: null,
			validityCSPLicense: ""
		};
	}

	saveLicense() {
		let errToast = null;
		NativeModules.Wrap_License.setCSPLicense(
			this.state.keylicenseCryptoPro,
			(err, label) => {
				if (!label) {
					errToast = "Ошибка";
				}
				NativeModules.Wrap_License.checkValidateInputLicense(
					this.state.keylicenseApp,
					(err, label) => {
						if (err) {
							if (errToast) {
								showToastDanger("Введеные лицензии не действительны");
							} else {
								showToastDanger("Ошибка лицензии CryptoARM GOST, введенная лицензия не была сохранена");
							}
						} else {
							if (errToast) {
								showToastDanger("Ошибка лицензии CryptoPro CSP");
							} else {
								showToast("Лицензии успешно установлены");
							}
						}
						NativeModules.Wrap_License.getValidityTimeOfLicense(
							(err, label) => {
								this.setState({ validityTimeOfLicense: label });
							});
						NativeModules.Wrap_License.CSPLicenseCheck(
							(err, label) => {
								this.setState({ validityCSPLicense: label });
							});
					});
			});
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		console.log("validityTimeOfLicense: " + this.state.validityTimeOfLicense);
		return (
			<Container style={styles.container}>
				<Headers title="Лицензии" goBack={() => goBack()} />
				<Content style={{ backgroundColor: "white" }}>
					<View>
						<Image style={styles.prop_cert_img} source={require("../../imgs/general/splash_icon.png")} />
						<Text style={styles.prop_cert_title}>КриптоАРМ ГОСТ</Text>
						<Text style={styles.prop_cert_status}>версия: 1.0.0</Text>
					</View>
					<Form>
						<Item stackedLabel>
							<Label>Лицензия</Label>
							<Input
								placeholder={"Введите ключ лицензии"}
								placeholderTextColor={"lightgrey"}
								value={this.state.keylicenseApp}
								onChangeText={(keylicense) => this.setState({ keylicenseApp: keylicense })} />
						</Item>
					</Form>
					<View style={{ padding: 15 }}>
						<Text style={{ color: "grey" }}>Статус:
							{this.state.validityTimeOfLicense
								? <Text style={{ color: "green" }}> действителен</Text>
								: <Text style={{ color: "red" }}> недействителен</Text>
							}</Text>
						{this.state.validityTimeOfLicense
							? <Text style={{ color: "grey" }}>Срок действия:
							{this.state.validityTimeOfLicense === 1543017600
									? <Text style={{ color: "green" }}> бессрочная</Text>
									: <Text style={{ color: "red" }}> до: {new Date(this.state.validityTimeOfLicense).toLocaleString("ru", options)}</Text>
								}</Text>
							: null
						}
					</View>
					<View>
						<Image style={[styles.prop_cert_img, { width: 160 }]} source={require("../../imgs/general/cryptopro.png")} />
						<Text style={[styles.prop_cert_title, { left: 200 }]}>КриптоПро CSP</Text>
						<Text style={[styles.prop_cert_status, { left: 200 }]}>версия: {this.state.CSPVersion}</Text>
					</View>
					<Form>
						<Item stackedLabel>
							<Label>Лицензия</Label>
							<Input
								placeholder={"Введите ключ лицензии"}
								placeholderTextColor={"lightgrey"}
								value={this.state.keylicenseCryptoPro}
								onChangeText={(keylicense) => this.setState({ keylicenseCryptoPro: keylicense })} />
						</Item>
					</Form>
					<View style={{ padding: 15 }}>
						<Text style={{ color: "grey" }}>Статус:
							{this.state.validityCSPLicense ?
								<Text style={{ color: "green" }}> действителен</Text>
								: <Text style={{ color: "red" }}> недействителен</Text>}
						</Text>
					</View>
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
		// this.readLicense();
		NativeModules.Wrap_License.getLicense(
			(err, label) => {
				(err) ? null : this.setState({ keylicenseApp: label });
			});
		NativeModules.Wrap_License.getCSPLicense(
			(err, label) => {
				if (err) {
					null;
				} else {
					label = label.substr(0, 5) + "-" + label.substr(5, 5) + "-" + label.substr(10, 5) + "-" +
						label.substr(15, 5) + "-" + label.substr(20, 5);
					this.setState({ keylicenseCryptoPro: label });
				}
			});
		// отображение версии КриптоПРО CSP
		NativeModules.Wrap_Main.getCSPVersion(
			(err, label) => {
				this.setState({ CSPVersion: label });
			});

		// отображение версии ядра СКЗИ
		NativeModules.Wrap_Main.getCSPCoreVersion(
			(err, label) => {
				this.setState({ CSPCoreVersion: label });
			});
		NativeModules.Wrap_License.getValidityTimeOfLicense(
			(err, label) => {
				if (!err) {
					this.setState({ validityTimeOfLicense: label });
				}
			});
		NativeModules.Wrap_License.CSPLicenseCheck(
			(err, label) => {
				if (!err) {
					this.setState({ validityCSPLicense: label });
				}
			});
	}
}