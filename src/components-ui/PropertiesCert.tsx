import * as React from "react";
import { Container, ListItem, View, List, Content, Text, Footer, FooterTab } from "native-base";
import { Image, AlertIOS, NativeModules, Alert } from "react-native";
import { Headers } from "../components/Headers";
import { styles } from "../styles";
import { FooterButton } from "../components/FooterButton";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { readCertKeys } from "../actions/certKeysAction";
import { deleteCertAction } from "../actions/deleteCertAction";

function mapDispatchToProps(dispatch) {
	return {
		readCertKeys: bindActionCreators(readCertKeys, dispatch),
		deleteCertAction: bindActionCreators(deleteCertAction, dispatch)
	};
}

interface ListForCertProps {
	title: string;
	value?: string;
	first?: boolean;
	itemHeader?: boolean;
}

class ListForCert extends React.Component<ListForCertProps> {

	render() {
		return (
			<ListItem first={this.props.first} itemHeader={this.props.itemHeader}>
				<Text style={{ width: "50%" }}>{this.props.title}</Text>
				{this.props.value ? <Text style={styles.prop_cert_righttext}>{this.props.value}</Text> : null}
			</ListItem>
		);
	}
}

interface PropertiesCertProps {
	navigation: any;
	cert: string;
	readCertKeys(): void;
	deleteCertAction(cert, withContainers, key, goBack): void;
}

@(connect(null, mapDispatchToProps) as any)
export class PropertiesCert extends React.Component<PropertiesCertProps> {

	static navigationOptions = {
		header: null
	};

	deleteCert() {
		if (this.props.navigation.state.params.cert.hasPrivateKey) {
			AlertIOS.alert(
				"Удалить сертификат '" + this.props.navigation.state.params.cert.subjectFriendlyName + "' с контейнером?",
				null,
				[
					{
						text: "Да", onPress: () => {
							this.props.deleteCertAction(this.props.navigation.state.params.cert, true, this.props.navigation.state.params.key, this.props.navigation.goBack());
						}
					},
					{
						text: "Нет", onPress: () => {
							this.props.deleteCertAction(this.props.navigation.state.params.cert, false, this.props.navigation.state.params.key, this.props.navigation.goBack());
						}
					},
					{ text: "Отмена", onPress: () => null, style: "cancel" }
				]
			);
		} else {
			AlertIOS.alert(
				"Удалить сертификат?",
				null,
				[
					{
						text: "Да", onPress: () => {
							this.props.deleteCertAction(this.props.navigation.state.params.cert, false, this.props.navigation.state.params.key, this.props.navigation.goBack());
						}
					},
					{ text: "Отмена", onPress: () => null, style: "cancel" }
				]
			);
		}
	}

	render() {
		const { cert, isCertInContainers, containers, key } = this.props.navigation.state.params;
		console.log(key);
		const { navigate, goBack } = this.props.navigation;
		let subjectFriendlyName, subjectEmail, subjectCountry, subjectRegion, subjectCity;
		if (!cert.selfSigned) {
			subjectFriendlyName = cert.subjectName.match(/2.5.4.3=[^\/]{1,}/);
			subjectFriendlyName = subjectFriendlyName ? subjectFriendlyName[0].replace("2.5.4.3=", "") : null;

			subjectEmail = cert.subjectName.match(/1.2.840.113549.1.9.1=[^\/]{1,}/);
			subjectEmail = subjectEmail ? subjectEmail[0].replace("1.2.840.113549.1.9.1=", "") : null;

			subjectCountry = cert.subjectName.match(/2.5.4.6=[^\/]{1,}/);
			subjectCountry = subjectCountry ? subjectCountry[0].replace("2.5.4.6=", "") : null;

			subjectRegion = cert.subjectName.match(/2.5.4.8=[^\/]{1,}/);
			subjectRegion = subjectRegion ? subjectRegion[0].replace("2.5.4.8=", "") : null;

			subjectCity = cert.subjectName.match(/2.5.4.7=[^\/]{1,}/);
			subjectCity = subjectCity ? subjectCity[0].replace("2.5.4.7=", "") : null;
		}
		let issuerEmail = cert.issuerName.match(/1.2.840.113549.1.9.1=[^\/]{1,}/);
		issuerEmail = issuerEmail ? issuerEmail[0].replace("1.2.840.113549.1.9.1=", "") : null;
		let issuerCountry = cert.issuerName.match(/2.5.4.6=[^\/]{1,}/);
		issuerCountry = issuerCountry ? issuerCountry[0].replace("2.5.4.6=", "") : null;
		let issuerRegion = cert.issuerName.match(/2.5.4.8=[^\/]{1,}/);
		issuerRegion = issuerRegion ? issuerRegion[0].replace("2.5.4.8=", "") : null;
		let issuerCity = cert.issuerName.match(/2.5.4.7=[^\/]{1,}/);
		issuerCity = issuerCity ? issuerCity[0].replace("2.5.4.7=", "") : null;
		let organizationName = cert.issuerName.match(/2.5.4.10=[^\/]{1,}/);
		organizationName = organizationName ? organizationName[0].replace("2.5.4.10=", "") : null;
		return (
			<Container style={styles.container}>
				<Headers title="Свойства сертфиката" goBack={() => goBack()} goHome={() => this.props.navigation.goBack("Home")} />
				<Content style={{ backgroundColor: "white" }}>
					<View>
						<Image style={styles.prop_cert_img} source={cert.chainBuilding ? require("../../imgs/general/cert_ok_icon.png") : require("../../imgs/general/cert_bad_icon.png")} />
						<Text style={styles.prop_cert_title}>{cert.subjectFriendlyName}</Text>
						<Text style={styles.prop_cert_status}>Cтатус сертификата:{"\n"}
							{cert.chainBuilding ? <Text style={{ color: "green" }}>действителен</Text> : <Text style={{ color: "red" }}>не действителен</Text>}
						</Text>
					</View>
					<List>
						{cert.selfSigned ? null : <>
							<ListForCert itemHeader first title="Владелец" />
							<ListForCert title="Имя:" value={subjectFriendlyName} />
							{subjectEmail ? <ListForCert title="Email:" value={subjectEmail} /> : null}
							{cert.organizationName ? <ListForCert title="Огранизация:" value={cert.organizationName} /> : null}
							{subjectCountry ? <ListForCert title="Страна:" value={subjectCountry} /> : null}
							{subjectRegion ? <ListForCert title="Регион:" value={subjectRegion} /> : null}
							{subjectCity ? <ListForCert title="Город:" value={subjectCity} /> : null}
						</>}
						<ListForCert itemHeader first title={"Издатель " + [cert.selfSigned ? "и владелец" : null]} />
						<ListForCert title="Имя:" value={cert.issuerFriendlyName} />
						{issuerEmail ? <ListForCert title="Email:" value={issuerEmail} /> : null}
						{organizationName ? <ListForCert title="Огранизация:" value={organizationName} /> : null}
						{issuerCountry ? <ListForCert title="Страна:" value={issuerCountry} /> : null}
						{issuerRegion ? <ListForCert title="Регион:" value={issuerRegion} /> : null}
						{issuerCity ? <ListForCert title="Город:" value={issuerCity} /> : null}

						<ListForCert itemHeader title="Сертфикат" />
						<ListForCert title="Серийный номер:" value={cert.serialNumber} />
						<ListForCert title="Годен до:" value={cert.notAfter} />
						<ListForCert title="Алгоритм подписи:" value={cert.publicKeyAlgorithm} />
						<ListForCert title="Хэш-алгоритм:" value={cert.signatureDigestAlgorithm} />
						<ListForCert title="Закрытый ключ:" value={cert.hasPrivateKey ? "присутствует" : "отсутствует"} />
					</List>
				</Content>
				<Footer>
					{isCertInContainers === true ?
						<FooterTab>
							<FooterButton title="Установить"
								icon="md-add"
								nav={() => {
									NativeModules.Wrap_Main.installCertFromContainer(containers, (err) => {
										if (err) {
											Alert.alert("Установка сертификата не удалась");
										} else {
											this.props.readCertKeys();
											AlertIOS.alert(
												"Сертификат установлен",
												null,
												[{
													text: "ОК", onPress: () => {
														this.props.navigation.goBack("Home");
													}
												}]
											);
										}
									});
								}} />
						</FooterTab> :
						<FooterTab>
							<FooterButton title="Экспортировать"
								icon="ios-share-alt-outline"
								nav={() => navigate("ExportCert", { cert: cert })} />
							<FooterButton title="Удалить" icon="md-trash" nav={() => this.deleteCert()} />
						</FooterTab>
					}
				</Footer>
			</Container>
		);
	}
}