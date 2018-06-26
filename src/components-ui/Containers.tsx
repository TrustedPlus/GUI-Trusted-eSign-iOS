import * as React from "react";
import { Container, Content, List, Text, Toast } from "native-base";
import { Headers } from "../components/Headers";
import { NativeModules } from "react-native";
import { ListMenu } from "../components/ListMenu";
import { styles } from "../styles";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getProviders } from "../actions/getContainersAction";

function mapStateToProps(state) {
	return {
		containers: state.containers.containers
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getProviders: bindActionCreators(getProviders, dispatch)
	};
}

interface ContainersProps {
	navigation: any;
	goBack: void;
	containers: any;
	getProviders(): void;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Containers extends React.Component<ContainersProps> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.props.navigation.state.key = "Home";
	}

	showList() {
		if (this.props.containers[0]) {
			return (this.props.containers.map((containers, key) => <ListMenu
				key={key}
				note={"HDIMAGE"}
				title={containers.container}
				nav={() => NativeModules.Wrap_Main.getCertInfoFromContainer(
					containers["fqcnA"],
					(err, cert) => {
						if (err) {
							Toast.show({
								text: "В контейнере нет сертификата",
								position: "bottom",
								duration: 700
							});
						} else {
							this.props.navigation.navigate("PropertiesCert", { cert: cert[0], isCertInContainers: true, containers: containers["fqcnA"] });
						}
					})
				} />));
		}
	}

	render() {
		const { goBack } = this.props.navigation;
		return (
			<Container style={styles.container}>
				<Headers title="Контейнеры" goBack={() => goBack()} />
				<Content>
					{this.props.containers.length !== 0 ?
						<List>{this.showList()}</List> :
						<Text style={[styles.sign_enc_prompt, { paddingTop: "50%", paddingLeft: 5, paddingRight: 5 }]}>Контейнеров нет. Создайте или импортируйте сертификат с закрытым ключом.</Text>}
				</Content>
			</Container>
		);
	}

	componentDidMount() {
		this.props.getProviders();
	}
}