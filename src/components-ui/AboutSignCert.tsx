import * as React from "react";
import { View } from "react-native";
import { Container, List, Content, Segment, Button, Text } from "native-base";
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

export class AboutSignCert extends React.Component<AboutSignCertProps, AboutSignCertState> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);

		this.state = {
			numPage: 1,
		};
	}

	chainList(cert) {
		return (cert.map((cert, key) => {
			return (
				<View key={key}>
					<Text style={[styles.sign_enc_title, { paddingTop: 30 }]}>Состав цепочки</Text>
					{cert.chain.map((cert, key, arr) =>
						cert.errorCode ? null :
							<List key={key} style={{ paddingTop: 10 }}>
								<ListMenu numChain={key} lengthChain={arr.length} title={cert.subjectName.match(/2.5.4.3=[^\/]{1,}/)[0].replace("2.5.4.3=", "")} img={require("../../imgs/general/cert_ok_icon.png")}
									note={cert.subjectName.match(/2.5.4.10=[^\/]{1,}/) ? cert.subjectName.match(/2.5.4.10=[^\/]{1,}/)[0].replace("2.5.4.10=", "") : null} nav={() => null} />
							</List>
					)}
				</View>
			);
		}
		));
	}

	showList(cert) {
		return (cert.map((cert, key) =>
			<List key={key} style={{ paddingTop: 10, paddingBottom: 30 }}>
				<ListForCert title="Статус" value={cert.status === "1" ? "подпись действительна" : "подпись не действительна"} />
				<ListForCert title="Время подписи:" value={cert.signingTime} />
				<ListForCert title="Алгоритм подписи:" value={cert.signatureAlgorithm} />
				<ListForCert title="Владелец сертификата" value={cert.subjectName.match(/2.5.4.3=[^\/]{1,}/)[0].replace("2.5.4.3=", "")} />
				<ListForCert title="Кем выдан" value={cert.issuerName.match(/2.5.4.3=[^\/]{1,}/)[0].replace("2.5.4.3=", "")} />
				<ListForCert title="Годен до:" value={cert.notAfter} />
			</List>
		));
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		const { cert } = this.props.navigation.state.params.cert;
		console.log(cert);
		return (
			<Container style={styles.container}>
				<Headers title="Свойства подписи" goBack={() => goBack()} />
				<Segment style={{ backgroundColor: "white" }}>
					<Button
						first
						style={[{ width: "48%", borderColor: "grey" }, this.state.numPage === 1 ? { backgroundColor: "lightgrey" } : null]}
						active={this.state.numPage === 1 ? true : false}
						onPressIn={() => this.setState({ numPage: 1 })}>
						<Text style={{ color: "black" }}>Сертификат</Text>
					</Button>
					<Button
						last
						style={[{ width: "48%", borderColor: "grey" }, this.state.numPage === 2 ? { backgroundColor: "lightgrey" } : null]}
						active={this.state.numPage === 2 ? true : false}
						onPressIn={() => this.setState({ numPage: 2 })}>
						<Text style={{ color: "black" }}>Цепочка доверия</Text>
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