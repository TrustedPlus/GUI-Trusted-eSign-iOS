import * as React from "react";
import { Container, List, Content, Title, Text, Button, Icon } from "native-base";
import { Image } from "react-native";
import { Headers } from "../components/Headers";
import { ListMenu } from "../components/ListMenu";
import { styles } from "../styles";
import { AddCertButton } from "../components/AddCertButton";
import Collapsible from "react-native-collapsible";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addCert, addCertForEnc } from "../actions";

function mapStateToProps(state) {
	return {
		certificates: state.certificates.certificates
	};
}

function mapDispatchToProps(dispatch) {
	return {
		addCert: bindActionCreators(addCert, dispatch),
		addCertForEnc: bindActionCreators(addCertForEnc, dispatch)
	};
}

interface SelectCertProps {
	navigation: any;
	certificates: any;
	addCert(uri: string, fileName: string, password: string, fn: Function): Function;
	addCertForEnc?(certs: any): void;
} // title: string, img: string, note: string, issuerName: string, serialNumber: string, provider: string, category: string, hasPrivateKey: boolean

interface SelectCertState {
	collapsedPersonalCert: boolean;
	collapsedOtherCert: boolean;
	arrEncCertificates: any;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class SelectCert extends React.Component<SelectCertProps, SelectCertState> {

	constructor(props) {
		super(props);

		this.state = {
			collapsedPersonalCert: false,
			collapsedOtherCert: false,
			arrEncCertificates: []
		};
		this.props.navigation.state.key = "Encryption";
	}

	arrNumSelectedCertificates(cert) {
		let oldArrEncCertificates = this.state.arrEncCertificates.slice(0);
		let index = oldArrEncCertificates.indexOf(cert);
		if (index !== -1) {
			oldArrEncCertificates.splice(index, 1); // удаление из массива
		} else {
			oldArrEncCertificates.push(cert);
		}
		this.setState({ arrEncCertificates: oldArrEncCertificates });
	}

	ShowListOtherCert(img) {
		return (
			this.props.certificates.map((cert, key) => ((cert.category.toUpperCase() === "OTHERS") || (cert.category.toUpperCase() === "ADDRESSBOOK")) ? <ListMenu
				key={key}
				title={cert.subjectFriendlyName}
				note={cert.organizationName}
				img={img[key]}
				// ={(page, cert1) => { this.props.navigation.navigate(page, { cert: cert1 }); }}
				nav={() => this.arrNumSelectedCertificates(cert)}
				checkbox
			// cert={cert}
			// arrow
			/> : null));
	}

	ShowList(img) {
		return (
			this.props.certificates.map((cert, key) => (cert.category.toUpperCase() === "MY") ? <ListMenu
				key={key}
				title={cert.subjectFriendlyName}
				note={cert.organizationName}
				img={img[key]}
				// navigate={(page, cert1) => { this.props.navigation.navigate(page, { cert: cert1 }); }}
				checkbox
				nav={() => this.arrNumSelectedCertificates(cert)}
			// cert={cert}
			// arrow
			/> : null));
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		const { certificates, addCertForEnc, addCert } = this.props;
		let img = [];
		for (let i = 0; i < certificates.length; i++) {
			certificates[i].chainBuilding ?
				img[i] = require("../../imgs/general/cert2_ok_icon.png") :
				img[i] = require("../../imgs/general/cert2_bad_icon.png");
		}
		return (
			<Container style={styles.container}>
				<Headers title="Выберите сертификат" goBack={() => goBack()} />
				<Content>
					<List>
						{(certificates.filter((cert) => (cert.category.toUpperCase() === "MY") && (cert.hasPrivateKey))).length !== 0
							? <Button style={styles.buttonCollapsed} onPressIn={() => this.setState({ collapsedPersonalCert: !this.state.collapsedPersonalCert })}>
								<Text style={{ color: "grey" }}>Личные сертификаты</Text>
								{this.state.collapsedPersonalCert
									? <Icon style={styles.iconCollapsed} name="ios-arrow-down" />
									: <Icon style={styles.iconCollapsed} name="ios-arrow-up" />}
							</Button>
							: null}
						<Collapsible collapsed={this.state.collapsedPersonalCert}>
							<List>{this.ShowList(img)}</List>
						</Collapsible>
						{(certificates.filter((cert) => ((cert.category.toUpperCase() === "OTHERS") || (cert.category.toUpperCase() === "ADDRESSBOOK")))).length !== 0
							? <Button style={styles.buttonCollapsed} onPressIn={() => this.setState({ collapsedOtherCert: !this.state.collapsedOtherCert })}>
								<Text style={{ color: "grey" }}>Сертификаты других пользователей</Text>
								{this.state.collapsedOtherCert
									? <Icon style={styles.iconCollapsed} name="ios-arrow-down" />
									: <Icon style={styles.iconCollapsed} name="ios-arrow-up" />}
							</Button>
							: (certificates.filter((cert) => (cert.category.toUpperCase() === "MY") && (cert.hasPrivateKey))).length !== 0
								? null
								: <Text style={[styles.sign_enc_prompt, { paddingTop: "50%" }]}>Сертификатов нет. Нажмите кнопку 'добавить' для импорта или создания сертификата</Text>}
						<Collapsible collapsed={this.state.collapsedOtherCert}>
							<List>{this.ShowListOtherCert(img)}</List>
						</Collapsible>
					</List>
				</Content>
				{
					this.state.arrEncCertificates.length === 0
						? <AddCertButton navigate={(page) => navigate(page)} addCertFunc={(uri, fileName, password, fn) => addCert(uri, fileName, password, fn)} />
						: <Button transparent style={{ position: "absolute", bottom: 40, right: 30 }} onPressIn={() => {
							addCertForEnc(this.state.arrEncCertificates);
							this.props.navigation.goBack();
						}}>
							<Image style={{ width: 60, height: 60 }} source={require("../../imgs/general/confirm.png")} />
						</Button>
				}
			</Container>
		);
	}
}