import * as React from "react";
import { Container, Item, Label, Input, Footer, FooterTab, Button, Text, Content, Icon, Form } from "native-base";
import { Headers } from "../components/Headers";
import { styles } from "../styles";
import { View } from "react-native";
import * as RNFS from "react-native-fs";
import { genSelfSignedCertWithoutRequest } from "../utils/createCert";
import { ListWithModalDropdown } from "../components/ListWithModalDropdown";
import { ListWithSwitch } from "../components/ListWithSwitch";
import { FooterButton } from "../components/FooterButton";
import Collapsible from "react-native-collapsible";
import { showToast, showToastDanger } from "../utils/toast";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { readCertKeys, createCert } from "../actions/certKeysAction";
import { getProviders } from "../actions/getContainersAction";
import { readFiles } from "../actions/index";
import { createRequest, readRequests } from "../actions/requestAction";

function mapDispatchToProps(dispatch) {
	return {
		readCertKeys: bindActionCreators(readCertKeys, dispatch),
		createCert: bindActionCreators(createCert, dispatch),
		createRequest: bindActionCreators(createRequest, dispatch),
		getProviders: bindActionCreators(getProviders, dispatch),
		readFiles: bindActionCreators(readFiles, dispatch),
		readRequests: bindActionCreators(readRequests, dispatch)
	};
}

interface CreateCertificateState {
	algorithm: any;
	keyLength: number;
	keyAssignment: number;
	certAssignment: boolean;
	server_auth: boolean;
	client_auth: boolean;
	code_sign: boolean;
	email_protection: boolean;
	cert_template: number;
	CN: string;
	email: string;
	org: string;
	city: string;
	obl: string;
	country: string;
	errorInputCN: boolean;
	errorInputEmail: boolean;
	isselfsign: boolean;
}

interface CreateCertificateProps {
	navigation: any;
	dispatch: any;
	readCertKeys(): void;
	readFiles(): void;
	createCert(CN: string): void;
	getProviders(): any;
	createRequest(CN: string): void;
	readRequests(): void;
}

@(connect(null, mapDispatchToProps) as any)
export class CreateCertificate extends React.Component<CreateCertificateProps, CreateCertificateState> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		const { requestsProperties } = this.props.navigation.state.params === undefined ? false : this.props.navigation.state.params;

		this.state = {
			algorithm: "GOST R 34.10-2012 256-bit",
			keyLength: 512,
			keyAssignment: 0,
			certAssignment: true,
			server_auth: requestsProperties ? Boolean(requestsProperties.extKeyUsage_server) : false,
			client_auth: requestsProperties ? Boolean(requestsProperties.extKeyUsage_client) : true,
			code_sign: requestsProperties ? Boolean(requestsProperties.extKeyUsage_code) : false,
			email_protection: requestsProperties ? Boolean(requestsProperties.extKeyUsage_email) : true,
			cert_template: 0,
			CN: "",
			email: "",
			org: "",
			city: "",
			obl: "",
			country: "RU",
			errorInputCN: false,
			errorInputEmail: false,
			isselfsign: false
		};
		this.onPressCertRequest = this.onPressCertRequest.bind(this);
	}

	onValueChange(value: string) {
		this.setState({
			algorithm: value
		});
	}

	onPressCertRequest() {
		if (this.state.CN !== "") {
			if (this.state.email && this.state.email.match(/^\w+@\w+\.\w{2,4}$/i) === null) {
				this.setState({ errorInputEmail: true });
				showToast("Поле email не корректно");
			} else {
				genSelfSignedCertWithoutRequest(
					this.state.algorithm,
					this.state.keyAssignment,
					//  назначение сертификата (EKU)
					[this.state.server_auth, // проверка подлинности сервера
					this.state.client_auth, // проверка подлинности клиента
					this.state.code_sign, // подпись кода
					this.state.email_protection], // защита элкетронной почты
					// параметры субъекта
					this.state.CN,
					this.state.email,
					this.state.org,
					this.state.city,
					this.state.obl,
					this.state.country,
					this.state.isselfsign
				).then(() => {
					setTimeout(() => {
						if (this.state.isselfsign) {
							this.props.createCert(this.state.CN); // TODO, исправить
							RNFS.unlink(RNFS.DocumentDirectoryPath + "/Files/" + this.state.CN + ".cer");
							this.props.readCertKeys();
							this.props.getProviders();
							this.props.navigation.goBack();
							showToast("Сертификат и ключ создан");
						} else {
							this.props.createRequest(this.state.CN); // TODO, исправить
							this.props.readRequests();
							this.props.navigation.goBack();
							showToast("Запрос на сертификат создан и сохранен в 'Управление сертификатами/Запросы'");
						}
					}, 500);
				}).catch(err => {
					if (err.indexOf("0x8010006E") !== 1) {
						showToast("Действие было отменено");
					} else {
						showToastDanger(err + "");
					}
				});
			}
		} else {
			this.setState({ errorInputCN: true });
			showToast("Заполните поле CN");
		}
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		const { requestsProperties } = this.props.navigation.state.params === undefined ? false : this.props.navigation.state.params;
		let defaultEmail, defaultOrg, defaultCity, defaultObl, defaultCountry;
		const defaultCN = requestsProperties ? requestsProperties.subjectName.match(/CN=[^,]{1,}/)[0].replace("CN=", "") : null;
		if (requestsProperties) {
			defaultEmail = requestsProperties.subjectName.match(/E=[^,]{1,}/);
			defaultEmail = defaultEmail ? defaultEmail[0].replace("E=", "") : null;

			defaultOrg = requestsProperties.subjectName.match(/O=[^,]{1,}/);
			defaultOrg = defaultOrg ? defaultOrg[0].replace("O=", "") : null;

			defaultCity = requestsProperties.subjectName.match(/L=[^,]{1,}/);
			defaultCity = defaultCity ? defaultCity[0].replace("L=", "") : null;

			defaultObl = requestsProperties.subjectName.match(/S=[^,]{1,}/);
			defaultObl = defaultObl ? defaultObl[0].replace("S=", "") : null;

			defaultCountry = requestsProperties.subjectName.match(/C=[^,]{1,}/);
			defaultCountry = defaultCountry ? defaultCountry[0].replace("C=", "") : null;
		}
		let defaultkeyUsage;
		if (requestsProperties) {
			switch (requestsProperties.keyUsage) {
				case 0: defaultkeyUsage = "Подпись и шифрование"; break;
				case 1: defaultkeyUsage = "Шифрование"; break;
				case 2: defaultkeyUsage = "Подпись"; break;
				default: defaultkeyUsage = "Подпись и шифрование";
			}
		} else { defaultkeyUsage = "Подпись и шифрование"; }
		return (
			<Container style={styles.container}>
				<Headers title="Создание запроса на сертификат" goBack={() => goBack()} />
				<Content>
					<View>
						<ListWithModalDropdown text="Алгоритм"
							defaultValue={requestsProperties ? requestsProperties.pubKey : "GOST R 34.10-2012 256-bit"}
							changeValue={(value) => this.setState({ algorithm: value })}
							options={[{ value: "GOST R 34.10-2001" }, { value: "GOST R 34.10-2012 256-bit" }, { value: "GOST R 34.10-2012 512-bit" }]} />
						{this.state.algorithm !== "RSA"
							? <ListWithModalDropdown text="Назначение ключа"
								defaultValue={defaultkeyUsage}
								changeValue={(value, index) => this.setState({ keyAssignment: Number(index) })}
								options={[{ value: "Подпись и шифрование" }, { value: "Шифрование" }, { value: "Подпись" }]} />
							: <ListWithModalDropdown text="Шаблон сертификата"
								defaultValue="Cертификат пользователя УЦ"
								changeValue={(value, index) => this.setState({ cert_template: Number(index) })}
								options={[{ value: "Cертификат пользователя УЦ" },
								{ value: "One day User" }, { value: "Временный сертификат Оператора УЦ" },
								{ value: "Временный сертификат пользователя УЦ" }, { value: "Сертификат ipsec" },
								{ value: "Сертификат Администратора для DSS" }, { value: "Сертификат аудитора журнала УЦ" },
								{ value: "Сертификат входа в домен по УЭК" }, { value: "Сертификат входа со смарт-картой" },
								{ value: "Сертификат контроллера домена (winlogon)" }, { value: "Сертификат оператора службы OCSP" },
								{ value: "Сертификат оператора службы штампов времени" }, { value: "Сертификат Оператора УЦ" },
								{ value: "Сертификат подписи (тест УЭК)" }, { value: "Сертификат подписи с лицензией (тест УЭК)" },
								{ value: "Сертификат пользователя DSS" }, { value: "Сертификат сервера" },
								{ value: "Совсем временный сертификат" }]} />}
					</View>
					<View style={{ paddingTop: 15, paddingBottom: 15 }}>
						<ListWithSwitch text="Создать как самоподписаннный сертификат" value={this.state.isselfsign} changeValue={() => this.setState({ isselfsign: !this.state.isselfsign })} />
					</View>
					<View style={styles.sign_enc_view}>
						<Text style={{ color: "grey" }}>Параметры субъекта</Text>
					</View>
					<Form>
						<Item floatingLabel error={this.state.errorInputCN ? true : false} >
							<Label>CN*</Label>
							<Input value={defaultCN} onChangeText={(CN) => this.setState({ CN })} />
						</Item>
						<Item floatingLabel error={this.state.errorInputEmail ? true : false} >
							<Label>email</Label>
							<Input value={defaultEmail ? defaultEmail : null} onChangeText={(email) => this.setState({ email })} />
						</Item>
						<Item floatingLabel>
							<Label>организация</Label>
							<Input value={defaultOrg ? defaultOrg : null} onChangeText={(org) => this.setState({ org })} />
						</Item>
						<Item floatingLabel>
							<Label>город</Label>
							<Input value={defaultCity ? defaultCity : null} onChangeText={(city) => this.setState({ city })} />
						</Item>
						<Item floatingLabel>
							<Label>область</Label>
							<Input value={defaultObl ? defaultObl : null} onChangeText={(obl) => this.setState({ obl })} />
						</Item>
					</Form>
					<ListWithModalDropdown text="страна"
						defaultValue={defaultCountry ? defaultCountry : "RU"}
						changeValue={(value) => this.setState({ country: value })}
						options={[{ value: "RU" }, { value: "GER" }]} />
					<Button style={{ width: "100%", backgroundColor: "white" }} onPress={() => this.setState({ certAssignment: !this.state.certAssignment })}>
						<Text style={{ color: "grey" }}>Назначение сертификата</Text>
						{this.state.certAssignment
							? <Icon style={{ color: "grey", position: "absolute", right: "5%" }} name="ios-arrow-down" />
							: <Icon style={{ color: "grey", position: "absolute", right: "5%" }} name="ios-arrow-up" />}
					</Button>
					<Collapsible collapsed={this.state.certAssignment}>
						<ListWithSwitch text="Проверка подлинности сервера" value={this.state.server_auth} changeValue={() => this.setState({ server_auth: !this.state.server_auth })} />
						<ListWithSwitch text="Проверка подлинности клиента" value={this.state.client_auth} changeValue={() => this.setState({ client_auth: !this.state.client_auth })} />
						<ListWithSwitch text="Подпись кода" value={this.state.code_sign} changeValue={() => this.setState({ code_sign: !this.state.code_sign })} />
						<ListWithSwitch text="Защита элкетронной почты" value={this.state.email_protection} last changeValue={() => this.setState({ email_protection: !this.state.email_protection })} />
					</Collapsible>
				</Content>
				<Footer>
					<FooterTab>
						<FooterButton title="Создать" icon="ios-create" nav={this.onPressCertRequest} />
					</FooterTab>
				</Footer>
			</Container>
		);
	}
}