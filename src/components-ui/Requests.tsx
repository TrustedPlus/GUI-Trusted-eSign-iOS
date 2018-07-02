import * as React from "react";
import { Container, Content, List, Text, Footer, FooterTab } from "native-base";
import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";
import { ListMenu } from "../components/ListMenu";
import { Headers } from "../components/Headers";
import { FooterButton } from "../components/FooterButton";
import { styles } from "../styles";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { deleteRequests } from "../actions/requestAction";

function mapStateToProps(state) {
	return {
		requests: state.requests.arrRequests,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		deleteRequests: bindActionCreators(deleteRequests, dispatch)
	};
}

interface RequestsProps {
	readRequests: Function;
	navigation: any;
	goBack: void;
	requests: any;
	deleteRequests(requests, selectedRequests): void;
}

interface RequestsState {
	selectedRequests: any;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Requests extends React.Component<RequestsProps, RequestsState> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);

		this.state = {
			selectedRequests: []
		};
	}

	changeSelectedRequests(oldSelectedRequests, key) {

		let index = oldSelectedRequests.indexOf(key);
		if (index !== -1) {
			oldSelectedRequests.splice(index, 1); // удаление из массива
			return oldSelectedRequests;
		}
		oldSelectedRequests.push(key);
		return oldSelectedRequests; // добавление в массив
	}

	showList() {
		return (
			this.props.requests.map((file, key) => <ListMenu
				key={key + file.time}
				title={file.name}
				note={file.date + " " + file.month + " " + file.year + ", " + file.time}
				img={require("../../imgs/general/file_unknown.png")}
				checkbox
				nav={() => this.setState({ selectedRequests: this.changeSelectedRequests(this.state.selectedRequests, key) })} />));
	}

	onPressGetRequestInfo() {
		NativeModules.Wrap_CertRequest.getRequestInfo(
			RNFS.DocumentDirectoryPath + "/Requests/" + this.props.requests[this.state.selectedRequests].name + ".csr",
			"BASE64",
			(err, verify) => {
				this.props.navigation.navigate("CreateCertificate", { requestsProperties: verify });
			});
	}

	render() {
		const { goBack } = this.props.navigation;
		return (
			<Container style={styles.container}>
				<Headers title="Запросы" goBack={() => goBack()} />
				<Content>
					<List>{this.showList()}</List>
				</Content>
				{this.state.selectedRequests.length ?
				<Footer>
					<FooterTab>
						<FooterButton disabled={this.state.selectedRequests.length !== 1} title="Создать сертифкат по шаблону" icon="create" nav={() => this.onPressGetRequestInfo()} />
						<FooterButton title="Удалить" icon="md-trash" nav={() => this.props.deleteRequests(this.props.requests, this.state.selectedRequests)} />
					</FooterTab>
				</Footer> : null}
			</Container>
		);
	}
}