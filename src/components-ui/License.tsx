import * as React from "react";
import * as RNFS from "react-native-fs";
import { styles } from "../styles";
import { Headers } from "../components/Headers";
import { Container, Footer, Text, View, FooterTab, Content, Form, Item, Button, Input } from "native-base";
import { FooterButton } from "../components/FooterButton";
import { Image, NativeModules, Linking } from "react-native";
import { showToast, showToastDanger } from "../utils/toast";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { refreshStatusLicense } from "../actions/refreshStatusAction";

function mapDispatchToProps(dispatch) {
	return {
		refreshStatusLicense: bindActionCreators(refreshStatusLicense, dispatch)
	};
}

interface LicenseProps {
	navigation: any;
	goBack: void;
	refreshStatusLicense(): any;
}

interface LicenseState {
	keylicenseApp: string;
	keylicenseCryptoPro: string;
	CSPVersion: string;
	CSPCoreVersion: string;
	validityLicense: number;
	timeOfLicense: any;
	validityCSPLicense: string;
	CSPLicenseTime: { code: number, description: string };
}

const optionsCAG = {
	year: "numeric", month: "long", day: "numeric"
};

const optionsCSP = {
	year: "numeric", month: "long", day: "numeric",
	hour: "numeric", minute: "numeric", second: "numeric"
};

@(connect(null, mapDispatchToProps) as any)
export class License extends React.Component<LicenseProps, LicenseState> {

	constructor(props) {
		super(props);

		this.state = {
			keylicenseApp: "", // CIMVH-DFXTC-VDXXQ-XJWRV-AWKTJ-VTWXJ-FKCAP
			keylicenseCryptoPro: "", // 40400-T0000-02WUR-TMDMX-50L66
			CSPVersion: null,
			CSPCoreVersion: null,
			validityLicense: null,
			timeOfLicense: -1,
			validityCSPLicense: "",
			CSPLicenseTime: {
				code: 0, description: ""
			}
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
						this.props.refreshStatusLicense();
						NativeModules.Wrap_License.getValidityTimeOfLicense(
							(err, label) => {
								if (!err) {
									if ((label !== 0) && ((label * 1000) < new Date().getTime())) {
										this.setState({ validityLicense: -1 });
										this.setState({ timeOfLicense: -1 });
									} else {
										this.setState({ validityLicense: 1 });
										this.setState({ timeOfLicense: label });
									}
								} else {
									this.setState({ validityLicense: 0 });
									this.setState({ timeOfLicense: -1 });
								}
							});
						NativeModules.Wrap_License.CSPLicenseCheck(
							(err, label) => {
								this.setState({ validityCSPLicense: label });
							});
						NativeModules.Wrap_License.getCSPLicenseTime(
							(err, label) => {
								this.setState({ CSPLicenseTime: label });
							});
					});
			});
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		return (
			<Container style={styles.container}>
				<Headers title="Лицензии" goBack={() => goBack()} />
				<Content style={{ backgroundColor: "white" }}>
					<View style={{ padding: 15 }}>
						<Image style={{ height: 70, width: 70, position: "absolute", right: 15, top: 15 }} source={require("../../imgs/general/splash_icon.png")} />
						<Text style={{ fontSize: 20 }}>КриптоАРМ ГОСТ</Text>
						<Text style={{ fontSize: 17, color: "grey" }}>версия: 1.0.2{"\n"}ООО «Цифровые технологии»</Text>
					</View>
					<View style={{ paddingLeft: 15, paddingRight: 15 }}>
						<Text style={{ color: "grey" }}>Лицензия</Text>
						<Form>
							<Item regular>
								<Input
									placeholder={"Введите ключ лицензии"}
									placeholderTextColor={"lightgrey"}
									value={this.state.keylicenseApp}
									onChangeText={(keylicense) => this.setState({ keylicenseApp: keylicense })} />
							</Item>
						</Form>
					</View>
					<View style={{ padding: 15 }}>
						<Text style={{ color: "grey" }}>Статус:
							{this.state.validityLicense
								? this.state.validityLicense === -1
									? <Text style={{ color: "red" }}> лицензия истекла</Text>
									: <Text style={{ color: "green" }}> действительная</Text>
								: <Text style={{ color: "red" }}> недействительная</Text>

							}</Text>
						{this.state.validityLicense
							? this.state.validityLicense !== -1
								? <Text style={{ color: "grey" }}>Срок действия:
							{this.state.timeOfLicense === 0
										? <Text> бессрочная</Text>
										: <Text> до {new Date(this.state.timeOfLicense * 1000).toLocaleString("ru", optionsCAG)}</Text>
									}
								</Text>
								: null
							: null
						}
						<Button style={{ backgroundColor: "#be3817", marginTop: 15, marginBottom: 5 }} onPress={() => Linking.openURL("https://cryptoarm.ru/shop/cryptoarm-gost")}><Text>Купить</Text></Button>
					</View>
					<View style={{ height: 1, backgroundColor: "#be3817" }}></View>
					<View style={{ padding: 15 }}>
						<Image style={{ height: 70, width: 160, position: "absolute", right: 15, top: 15 }} source={require("../../imgs/general/cryptopro.png")} />
						<Text style={{ fontSize: 20 }}>КриптоПро CSP</Text>
						<Text style={{ fontSize: 17, color: "grey" }}>версия: {this.state.CSPVersion}{"\n"}ООО «КРИПТО-ПРО»</Text>
					</View>
					<View style={{ paddingLeft: 15, paddingRight: 15 }}>
						<Text style={{ color: "grey" }}>Лицензия</Text>
						<Form>
							<Item regular>
								<Input
									placeholder={"Введите ключ лицензии"}
									placeholderTextColor={"lightgrey"}
									value={this.state.keylicenseCryptoPro}
									onChangeText={(keylicense) => this.setState({ keylicenseCryptoPro: keylicense })} />
							</Item>
						</Form>
					</View>
					<View style={{ padding: 15 }}>
						<Text style={{ color: "grey" }}>Статус:
							{this.state.validityCSPLicense ?
								<Text style={{ color: "green" }}> действительная</Text>
								: <Text style={{ color: "red" }}> недействительная</Text>}
						</Text>
						{this.state.CSPLicenseTime.code > 0
							? <Text style={{ color: "grey" }}>Срок действия:
						{this.state.CSPLicenseTime.description === "Permanent license."
									? <Text> бессрочная</Text>
									: <Text> до {new Date(this.state.CSPLicenseTime.code * 86400000 + new Date().getTime()).toLocaleString("ru", optionsCSP)}</Text>
								}
							</Text>
							: null}
						<Button style={{ backgroundColor: "#be3817", marginTop: 15 }} onPress={() => Linking.openURL("https://cryptoarm.ru/shop/skzi-cryptopro-csp-4-0")}><Text>Купить</Text></Button>
					</View>
				</Content>
				<Footer>
					<FooterTab>
						<FooterButton title="Сохранить" img={require("../../imgs/ios/save.png")} nav={() => this.saveLicense()} />
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
					RNFS.readFile(RNFS.DocumentDirectoryPath + "/cprocsp/etc/license.ini")
						.then((success) => {
							let index = success.indexOf("ProductID = ");
							this.setState({ keylicenseCryptoPro: success.substring(index + 13, success.length - 2) });
						})
						.catch((err) => {
							console.log(err.message);
						});
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
					if ((label !== 0) && ((label * 1000) < new Date().getTime())) {
						this.setState({ validityLicense: -1 });
						this.setState({ timeOfLicense: -1 });
					} else {
						this.setState({ validityLicense: 1 });
						this.setState({ timeOfLicense: label });
					}
				} else {
					this.setState({ validityLicense: 0 });
					this.setState({ timeOfLicense: -1 });
				}
			});
		NativeModules.Wrap_License.CSPLicenseCheck(
			(err, label) => {
				if (!err) {
					this.setState({ validityCSPLicense: label });
				}
			});
		// возвращает время действия лицензии КриптоПро
		NativeModules.Wrap_License.getCSPLicenseTime(
			(err, label) => {
				this.setState({ CSPLicenseTime: label });
			});
		this.props.refreshStatusLicense();
	}
}