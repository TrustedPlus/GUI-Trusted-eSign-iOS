import * as React from "react";
import { View, AlertIOS } from "react-native";
import { Container, List, Content, Segment, Button, Text, Header, Title, ListItem, Right, Icon, Left, Body } from "native-base";

import { Headers } from "../components/Headers";
import { styles } from "../styles";
import { ListForCert } from "../components/ListForCert";
import { ListMenu } from "../components/ListMenu";
import * as Modal from "react-native-modalbox";

interface AboutAllSignCertProps {
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

export class AboutAllSignCert extends React.Component<AboutAllSignCertProps> {

	showListCert(arrCert) {
		return (arrCert.map((cert, key, arr) =>
			<ListMenu
				notconect
				numChain={key}
				lengthChain={arr.length}
				key={key}
				img={(cert.statusCert === "1") && (cert.statusSign === "1") ? require("../../imgs/general/cert_ok_icon.png") : require("../../imgs/general/cert_bad_icon.png")}
				title={cert.subjectFriendlyName}
				note={cert.signingTime === "" ? "Дата подписи: отсутствует" : "Дата подписи: " + new Date(cert.signingTime).toLocaleString("ru", options)}
				nav={() => this.props.navigation.navigate("AboutSignCert", { cert: { cert: { cert }}})} />
		));
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		const { cert } = this.props.navigation.state.params.cert.cert;
		return (
			<Container style={styles.container}>
				<Headers title="Выбор подписи" goBack={() => goBack()} />
				<Content>
					{this.showListCert(cert)}
				</Content>
			</Container>
		);
	}
}