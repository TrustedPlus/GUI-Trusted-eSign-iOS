import * as React from "react";
import { View, AlertIOS, Image } from "react-native";
import { Container, List, Content, Segment, Button, Text, Header, Title, ListItem, Right, Icon, Left, Body } from "native-base";

import { Headers } from "../components/Headers";
import { styles } from "../styles";
import { ListForCert } from "../components/ListForCert";
import { ListMenu } from "../components/ListMenu";

interface AboutSignCertState {
	numPage: number;
}

interface AboutSignCertProps {
	navigation: any;
	goBack: void;
}

const options = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	second: "numeric"
};

export class AboutSignCert extends React.Component<AboutSignCertProps, AboutSignCertState> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);

		this.state = {
			numPage: 1
		};
	}

	chainList(cert) {
		const goodIcon = require("../../imgs/general/cert_ok_icon.png");
		const badIcon = require("../../imgs/general/cert_bad_icon.png");
		let icon = goodIcon;
		return (
			<View>
				<Text style={[styles.sign_enc_title, { paddingTop: 30 }]}>Состав цепочки</Text>
				{cert.chain.forEach(function (cert, i, arr) {
					if (cert.errorCode !== 0) {
						icon = badIcon;
					} else {
						icon = goodIcon;
					}
				})}
				{cert.chain.map((cert, key, arr) =>
					<List key={key} style={{ paddingTop: 10 }}>
						<ListMenu numChain={key} lengthChain={arr.length} title={cert.subjectName.match(/2.5.4.3=[^\/]{1,}/)[0].replace("2.5.4.3=", "")} img={icon}
							note={cert.subjectName.match(/2.5.4.10=[^\/]{1,}/) ? cert.subjectName.match(/2.5.4.10=[^\/]{1,}/)[0].replace("2.5.4.10=", "") : null} nav={() => null} />
					</List>
				)}
			</View>);
	}

	showList(cert) {
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
			<>
				<View style={{height: 150}}>
					<Image style={styles.prop_cert_img} source={(cert.statusCert === "1" && cert.statusSign === "1") ? require("../../imgs/general/cert_ok_icon.png") : require("../../imgs/general/cert_bad_icon.png")} />
					<Text style={styles.prop_cert_title}>{cert.subjectFriendlyName}</Text>
					<Text style={styles.prop_cert_status}>Cтатус сертификата:{"\n"}
						{cert.statusCert === "1" ? <Text style={{ color: "green" }}>действителен</Text> : <Text style={{ color: "red" }}>не действителен</Text>}
						{"\n"}{"\n"}Cтатус подписи:{"\n"}
						{cert.statusSign === "1" ? <Text style={{ color: "green" }}>действителен</Text> : <Text style={{ color: "red" }}>не действителен</Text>}
					</Text>
				</View>
				<List style={{ paddingTop: 10, paddingBottom: 30 }}>
					<ListForCert title="Время подписи:" value={cert.signingTime === "" ? "отсутствует" : new Date(cert.signingTime).toLocaleString("ru", options)} />
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
					<ListForCert itemHeader title="Сертификат" />
					<ListForCert title="Серийный номер:" value={cert.serialNumber} />
					<ListForCert title="Годен до:" value={cert.notAfter} />
					<ListForCert title="Алгоритм подписи:" value={cert.publicKeyAlgorithm} />
					<ListForCert title="Хэш-алгоритм:" value={cert.signatureDigestAlgorithm} />
				</List>
			</>
		);
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		const { cert } = this.props.navigation.state.params.cert.cert;
		console.log(cert);
		return (
			<Container style={styles.container}>
				<Headers title="Свойства подписи" goBack={() => goBack()} />
				<Segment style={{ backgroundColor: "white" }}>
					<Button
						first
						style={[{ width: "48.5%", borderColor: "grey" }, this.state.numPage === 1 ? { backgroundColor: "lightgrey" } : null]}
						active={this.state.numPage === 1 ? true : false}
						onPressIn={() => this.setState({ numPage: 1 })}>
						<Text style={{ color: "black", fontSize: 13 }}>Информация о подписи</Text>
					</Button>
					<Button
						last
						style={[{ width: "48.5%", borderColor: "grey" }, this.state.numPage === 2 ? { backgroundColor: "lightgrey" } : null]}
						active={this.state.numPage === 2 ? true : false}
						onPressIn={() => this.setState({ numPage: 2 })}>
						<Text style={{ color: "black", }}>Цепочка доверия</Text>
					</Button>
				</Segment>
				<Content>
					{this.state.numPage === 1
						? this.showList(cert)
						: this.chainList(cert)}
				</Content>
			</Container>
		);
	}
}