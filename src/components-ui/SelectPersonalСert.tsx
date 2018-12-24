import * as React from "react";
import { Container, List, Content, Text } from "native-base";
import { Headers } from "../components/Headers";
import { ListCert } from "../components/ListCert";
import { styles } from "../styles";
import { AddCertButton } from "../components/AddCertButton";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addCert, addCertForSign, personalCertClear } from "../actions";

function mapStateToProps(state) {
	return {
		certificates: state.certificates.certificates,
		services: state.services
	};
}

function mapDispatchToProps(dispatch) {
	return {
		addCert: bindActionCreators(addCert, dispatch),
		addCertForSign: bindActionCreators(addCertForSign, dispatch),
		personalCertClear: bindActionCreators(personalCertClear, dispatch)
	};
}

interface SelectPersonalСertProps {
	navigation: any;
	certificates: any;
	services: {
		services: Array<any>,
		lengthServices: number,
		lastid: number,
		certificate: any
	};
	addCert(uri: string, fileName: string, password: string, fn: Function): Function;
	addCertForSign?(cert: object, img: string): void;
	personalCertClear?();
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class SelectPersonalСert extends React.Component<SelectPersonalСertProps> {

	ShowList(img) {
		return (
			this.props.certificates.concat(this.props.services.certificate).map((cert, key) => ((cert.category.toUpperCase() === "MY") && cert.hasPrivateKey) ? <ListCert
				key={key}
				title={cert.subjectFriendlyName}
				note={cert.organizationName}
				img={(img[key] || img[key] === undefined) ? require("../../imgs/general/cert2_ok_icon.png") : require("../../imgs/general/cert2_bad_icon.png")}
				navigate={(page, cert1) => { this.props.navigation.navigate(page, { cert: cert1 }); }}
				goBack={() => {
					this.props.addCertForSign(cert, img[key]);
					this.props.navigation.goBack();
				}}
				rightimg={cert.transaction_id ? require("../../imgs/general/megafon.png") : false}
				cert={cert}
			/> : null));
	}

	render() {
		const { certificates, addCert } = this.props;
		const { navigate, goBack } = this.props.navigation;
		let img = [];
		for (let i = 0; i < certificates.length; i++) {
			certificates[i].chainBuilding ?
				img[i] = true : // require("../../imgs/general/cert2_ok_icon.png")
				img[i] = false; // require("../../imgs/general/cert2_bad_icon.png")
		}
		return (
			<Container style={styles.container}>
				<Headers title="Выберите сертификат" goBack={() => goBack()} />
				<Content>
					{(certificates.concat(this.props.services.certificate).filter((cert) => (cert.category.toUpperCase() === "MY") && (cert.hasPrivateKey))).length !== 0
						? <List>{this.ShowList(img)}</List>
						: <Text style={[styles.sign_enc_prompt, { paddingTop: "50%" }]}>Сертификатов нет. Нажмите кнопку 'добавить' для импорта или создания сертификата</Text>}
				</Content>
				<AddCertButton
					navigate={(page) => navigate(page)}
					addCertFunc={(uri, fileName, password, fn) => addCert(uri, fileName, password, fn)} />
			</Container>
		);
	}
}