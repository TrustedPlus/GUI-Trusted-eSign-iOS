import * as React from "react";
import * as RNFS from "react-native-fs";
import * as soap from "soap-everywhere";
import { styles } from "../styles";
import { Headers } from "../components/Headers";
import { Container, View, Input, Text, Item, Form, Footer, FooterTab, Content, List, Label } from "native-base";
import { FooterButton } from "../components/FooterButton";
import { Loader } from "../components/Loader";
import { ListMenu } from "../components/ListMenu";
import { ListCert } from "../components/ListCert";
import * as Modal from "react-native-modalbox";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createService, selectedService, connectToCervices } from "../actions/ServiceAction";

import { toBase64, fromBase64 } from "pvutils";

function mapStateToProps(state) {
	return {
		services: state.services
	};
}

function mapDispatchToProps(dispatch) {
	return {
		createService: bindActionCreators(createService, dispatch),
		selectedService: bindActionCreators(selectedService, dispatch),
		connectToCervices: bindActionCreators(connectToCervices, dispatch)
	};
}

interface SettingServiceProps {
	navigation: any;
	services: {
		services: Array<any>,
		lengthServices: number,
		lastid: number,
		certificate: any
	};
	connectToCervices(transaction_id, key, phone_number): void;
	createService(phone_number: string): void;
	selectedService(key): void;
}

interface SettingServiceState {
	phone_number: string;
	key: number;
	isFetching: boolean;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class SettingService extends React.Component<SettingServiceProps, SettingServiceState> {

	constructor(props) {
		super(props);

		this.state = {
			phone_number: "",
			key: null,
			isFetching: false
		};
	}

	aut() {
		let url = "https://msign.megafon.ru/mes-ws/auth?wsdl";
		let args = {
			partner_id: "digt",
			msisdn: this.state.phone_number, // "+79371111717",
			uri: "КриптоАРМ ГОСТ"
		};
		soap.createClient(url, (err, client) => {
			client.authenticate(args, (err, result) => {
				console.log(result);
				// AlertIOS.alert("status: " + result.status + "\ntransaction_id: " + result.transaction_id);
				if (result.status === "100") {
					this.props.connectToCervices(result.transaction_id, this.state.key, this.state.phone_number);
				}
				this.setState({ isFetching: !this.state.isFetching });
			});
		});
	}

	verifyNumber(phone_number) {
		return ((phone_number.search(/\+7\d{10}/) !== -1) && (phone_number.length === 12));
	}

	showList() {
		return (
			this.props.services.services.map((service, key) => <ListMenu
				key={key + Math.random()}
				title={service.name}
				note={service.status ? "статус: подключен" : "статус: не подключен"}
				img={require("../../imgs/general/megafon.png")}
				selected={service.isSelected}
				nav={() => this.props.selectedService(service.key)} />));
	}

	ShowListCert() {
		let cert = this.props.services.certificate[0];
		debugger;
		return (
			<ListCert
				img={require("../../imgs/general/cert_ok_icon.png")}
				title={cert.subjectFriendlyName}
				note={cert.organizationName}
				navigate={(page, cert1) => { this.props.navigation.navigate(page, { cert: cert1 }); }}
				goBack={() => { this.props.navigation.navigate("PropertiesCert", { cert: cert }); }}
				cert={cert}
				arrow />);
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		return (
			<Container style={styles.container}>
				<Headers title="Настройки подключения" goBack={() => goBack()} />
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Настройки подключения</Text>
					<Form>
						<Item floatingLabel style={{ paddingLeft: 10, paddingBottom: 10 }}>
							<Label>введите номер</Label>
							<Input onChangeText={(value) => this.setState({ phone_number: value })} />
						</Item>
					</Form>
					<Text style={[styles.sign_enc_title, { paddingTop: 30 }]}>Статус: {this.props.services.services[this.state.key - 1].status}</Text>
				</View>
				{
					this.props.services.certificate.length
						? <Content>
							<List>{this.ShowListCert()}</List>
						</Content>
						: <View style={styles.sign_enc_view}>
							<Text style={styles.sign_enc_prompt}>[Подключитесь к сервису]</Text>
						</View>
				}
				<Loader isFetching={this.state.isFetching} />
				{
					this.state.isFetching
						? null
						: <Footer style={{ position: "absolute", bottom: 0 }}>
							<FooterTab>
								<FooterButton title="Подключить"
									disabled={!this.verifyNumber(this.state.phone_number)}
									img={require("../../imgs/general/setting_icon.png")}
									nav={() => { this.setState({ isFetching: !this.state.isFetching }), this.aut(); }} />
							</FooterTab>
						</Footer>
				}
			</Container>
		);
	}

	componentWillMount() {
		for (let service of this.props.services.services) {
			if (service.isSelected) {
				this.setState({ key: service.key });
				break;
			}
		}
	}
}