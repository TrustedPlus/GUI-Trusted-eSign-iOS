import * as React from "react";
import { Container, List, Content, Title } from "native-base";
import { Headers } from "../components/Headers";
import { ListMenu } from "../components/ListMenu";
import { styles } from "../styles";
import { AddCertButton } from "../components/AddCertButton";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addCert } from "../actions/index";

function mapStateToProps(state) {
	return {
		certificates: state.certificates.certificates
	};
}

function mapDispatchToProps(dispatch) {
	return {
		addCert: bindActionCreators(addCert, dispatch)
	};
}

interface CertificateProps {
	navigation: any;
	certificates: any;
	addCert(uri: string, fileName: string, password: string): Function;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Certificate extends React.Component<CertificateProps> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.props.navigation.state.key = "Home";
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		let persCert = "количество сертификатов: " + this.props.certificates.filter((cert) => cert.category.toUpperCase() === "MY").length;
		let otherCert = "количество сертификатов: " + this.props.certificates.filter((cert) => (cert.category.toUpperCase() === "OTHERS") || (cert.category.toUpperCase() === "ADDRESSBOOK")).length;
		let adressBookCert = "количество сертификатов: " + this.props.certificates.filter((cert) => cert.category.toUpperCase() === "CA").length;
		let rootCert = "количество сертификатов: " + this.props.certificates.filter((cert) => (cert.category.toUpperCase() === "ROOT") || (cert.category.toUpperCase() === "TRUST")).length;
		return (
			<Container style={styles.container}>
				<Headers title="Сертификаты" goBack={() => goBack()} />
				<Content>
					<List>
						<ListMenu title="Личные сертификаты" img={require("../../imgs/general/certificates_menu_icon.png")}
							note={persCert} nav={() => navigate("ListCertCategory", { title: "Личные сертификаты", category: ["MY", null] })} />
						<ListMenu title="Сертификаты других пользователей" img={require("../../imgs/general/certificates_menu_icon.png")}
							note={otherCert} nav={() => navigate("ListCertCategory", { title: "Сертификаты других пользователей", category: ["OTHERS", "ADDRESSBOOK"] })} />
						<ListMenu title="Промежуточные сертификаты" img={require("../../imgs/general/certificates_menu_icon.png")}
							note={adressBookCert} nav={() => navigate("ListCertCategory", { title: "Промежуточные сертификаты", category: ["CA", null] })} />
						<ListMenu title="Доверенные корневые сертификаты" img={require("../../imgs/general/certificates_menu_icon.png")}
							note={rootCert} nav={() => navigate("ListCertCategory", { title: "Доверенные корневые сертификаты", category: ["ROOT", "TRUST"] })} />
					</List>
				</Content>
				<AddCertButton navigate={(page) => navigate(page)} addCertFunc={(uri, fileName, password) => this.props.addCert(uri, fileName, password)} />
			</Container>
		);
	}
}