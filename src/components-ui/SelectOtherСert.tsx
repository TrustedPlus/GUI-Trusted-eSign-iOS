import * as React from "react";
import { Container, List, Content, Text } from "native-base";
import { Headers } from "../components/Headers";
import { ListCert } from "../components/ListCert";
import { styles } from "../styles";
import { addCert } from "../actions/index";
import { AddCertButton } from "../components/AddCertButton";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addCertForEnc, otherCertClear } from "../actions/index";

function mapStateToProps(state) {
	return {
		certificates: state.certificates.certificates
	};
}

function mapDispatchToProps(dispatch) {
	return {
		addCert: bindActionCreators(addCert, dispatch),
		addCertForEnc: bindActionCreators(addCertForEnc, dispatch),
		otherCertClear: bindActionCreators(otherCertClear, dispatch)
	};
}

interface SelectOtherСertProps {
	navigation: any;
	certificates: any;
	addCert(uri: string, fileName: string, password: string, fn: Function): Function;
	addCertForEnc?(title: string, img: string, note: string, issuerName: string, serialNumber: string, provider: string, category: string, hasPrivateKey: boolean): void;
	otherCertClear(): void;
}

interface SelectOtherСertState {
	promptVisible: boolean;
	uri: string;
	fileName: string;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class SelectOtherСert extends React.Component<SelectOtherСertProps, SelectOtherСertState> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			promptVisible: false,
			uri: "",
			fileName: "",
		};
	}

	ShowList(img) {
		return (
			this.props.certificates.map((cert, key) => ((cert.category.toUpperCase() === "OTHERS") || (cert.category.toUpperCase() === "ADDRESSBOOK")) ? <ListCert
				key={key}
				title={cert.subjectFriendlyName}
				note={cert.organizationName}
				img={img[key]}
				navigate={(page, cert1) => { this.props.navigation.navigate(page, { cert: cert1 }); }}
				goBack={() => { this.props.addCertForEnc(cert.subjectFriendlyName, img[key], cert.organizationName, cert.issuerName, cert.serialNumber, cert.provider, cert.category, cert.hasPrivateKey !== 0 ? true : false); this.props.navigation.goBack("Encryption"); }}
				cert={cert}
				arrow /> : null));
	}

	render() {
		const { certificates } = this.props;
		const { navigate, goBack } = this.props.navigation;
		let img = [];
		for (let i = 0; i < certificates.length; i++) {
			certificates[i].chainBuilding ?
				img[i] = require("../../imgs/general/cert2_ok_icon.png") :
				img[i] = require("../../imgs/general/cert2_bad_icon.png");
		}
		return (
			<Container style={styles.container}>
				<Headers title="Выберите сертификат" goBack={() => { this.props.otherCertClear(); goBack(); }} />
				<Content>
					{(certificates.filter((cert) => ((cert.category.toUpperCase() === "OTHERS") || (cert.category.toUpperCase() === "ADDRESSBOOK")))).length !== 0 ?
						<List>{this.ShowList(img)}</List> :
						<Text style={[styles.sign_enc_prompt, { paddingTop: "50%" }]}>Сертификатов нет. Нажмите кнопку 'добавить' для импорта или создания сертификата</Text>}
				</Content>
				<AddCertButton navigate={(page) => navigate(page)} addCertFunc={(uri, fileName, password, fn) => this.props.addCert(uri, fileName, password, fn)} />
			</Container>
		);
	}
}