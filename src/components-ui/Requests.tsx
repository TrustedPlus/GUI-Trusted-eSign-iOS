import * as React from "react";
import { Container, Content, List, Text, Footer, FooterTab, View } from "native-base";
import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";
import { ListMenu } from "../components/ListMenu";
import { Headers } from "../components/Headers";
import { FooterButton } from "../components/FooterButton";
import { styles } from "../styles";
import { Share } from "react-native";
import { showToast, showToastDanger } from "../utils/toast";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { deleteRequests, selectedRequest } from "../actions/requestAction";

function mapStateToProps(state) {
	return {
		requests: state.requests.arrRequests,
		lengthSelectedRequests: state.requests.lengthSelectedRequests
	};
}

function mapDispatchToProps(dispatch) {
	return {
		deleteRequests: bindActionCreators(deleteRequests, dispatch),
		selectedRequest: bindActionCreators(selectedRequest, dispatch)
	};
}

interface RequestsProps {
	readRequests: Function;
	navigation: any;
	goBack: void;
	requests: any;
	lengthSelectedRequests: number;
	deleteRequests(requests): void;
	selectedRequest(key): void;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Requests extends React.Component<RequestsProps> {

	static navigationOptions = {
		header: null
	};

	showList(requests) {
		return (
			requests.map((file, key) => <ListMenu
				key={key + file.time}
				title={file.name}
				note={file.date + " " + file.month + " " + file.year + ", " + file.time}
				img={require("../../imgs/general/file_unknown.png")}
				selected={file.isSelected}
				nav={() => this.props.selectedRequest(key)} />));
	}

	onPressGetRequestInfo() {
		/*NativeModules.Wrap_CertRequest.getRequestInfo(
			RNFS.DocumentDirectoryPath + "/Requests/" + this.props.requests[this.state.selectedRequests].name + ".csr",
			"BASE64",
			(err, verify) => {
				this.props.navigation.navigate("CreateCertificate", { requestsProperties: verify, clearSelectesRequests: () => this.setState({ selectedRequests: [] }) });
			});*/
	}

	uploadFile(requests) {
		/*Share.share({
			url: RNFS.DocumentDirectoryPath + "/Requests/" + requests[selectedRequests[0]].name + ".csr"
		}).then((action: { action }) => {
			if (action.action === Share.dismissedAction) {
				showToast("Отправка запроса была отклонена");
			} else {
				showToast("Запрос успешно отправлен");
			}
		}).catch(
			errorMsg => showToastDanger(errorMsg)
		);*/
	}

	private getRequestsView(requests) {
		if (requests.length) {
			return (
				<Content>
					<List>{this.showList(requests)}</List>
				</Content>
			);
		}

		return (
			<View style={styles.sign_enc_view}>
				<Text style={[styles.sign_enc_prompt, { paddingTop: "50%" }]}>Запросов нет. Запросы создаются при создании сертификата</Text>
			</View>
		);
	}

	render() {
		const { goBack } = this.props.navigation;
		const filesView = this.getRequestsView(this.props.requests);
		return (
			<Container style={styles.container}>
				<Headers title="Запросы" goBack={() => goBack()} />
				{filesView}
				{this.props.lengthSelectedRequests ?
					<Footer>
						<FooterTab>
							<FooterButton disabled={this.props.lengthSelectedRequests !== 1} title="Создать запрос по шаблону" icon="create" nav={() => this.onPressGetRequestInfo()} />
							<FooterButton disabled={this.props.lengthSelectedRequests !== 1} title="Отправить" icon="ios-share-alt-outline" nav={() => this.uploadFile(this.props.requests)} />
							<FooterButton title="Удалить" icon="md-trash" nav={() => this.props.deleteRequests(this.props.requests)} />
						</FooterTab>
					</Footer> : null}
			</Container>
		);
	}
}