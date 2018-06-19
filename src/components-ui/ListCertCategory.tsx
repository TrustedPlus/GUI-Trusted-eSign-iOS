import * as React from "react";
import { Container, List, Content, Text } from "native-base";
import { Headers } from "../components/Headers";
import { ListCert } from "../components/ListCert";
import { styles } from "../styles";

import { connect } from "react-redux";

function mapStateToProps(state) {
	return {
		certificates: state.certificates.certificates
	};
}

interface ListCertCategoryProps {
	navigation: any;
	certificates: any;
	title: string;
	category: string;
}

@(connect(mapStateToProps) as any)
export class ListCertCategory extends React.Component<ListCertCategoryProps> {

	static navigationOptions = {
		header: null
	};

	ShowList(img) {
		return (
			this.props.certificates.map((cert, key) => (cert.category.toUpperCase() === this.props.navigation.state.params.category[0] || (cert.category.toUpperCase() === this.props.navigation.state.params.category[1])) ?
				<ListCert
					key={key}
					title={cert.subjectFriendlyName}
					note={cert.organizationName}
					img={img[key]}
					navigate={(page, cert1) => { this.props.navigation.navigate(page, { cert: cert1, key: key }); }}
					goBack={() => { this.props.navigation.navigate("PropertiesCert", { cert: cert, key: key }); }}
					cert={cert}
					arrow /> : null));
	}

	render() {
		const { certificates } = this.props;
		const { goBack, navigate } = this.props.navigation;
		let img = [];
		for (let i = 0; i < certificates.length; i++) {
			certificates[i].chainBuilding ?
				img[i] = require("../../imgs/general/cert2_ok_icon.png") :
				img[i] = require("../../imgs/general/cert2_bad_icon.png");
		}

		return (
			<Container style={styles.container}>
				<Headers title={this.props.navigation.state.params.title} goBack={() => goBack()} />
				<Content>
					{certificates.filter((cert) => ((cert.category.toUpperCase() === this.props.navigation.state.params.category[0]) || (cert.category.toUpperCase() === this.props.navigation.state.params.category[1]))).length !== 0 ?
						<List>{this.ShowList(img)}</List> :
						<Text style={[styles.sign_enc_prompt, { paddingTop: "50%" }]}>Сертификатов нет. Нажмите кнопку 'добавить' для импорта или создания сертификата</Text>}
				</Content>
			</Container>
		);
	}
}