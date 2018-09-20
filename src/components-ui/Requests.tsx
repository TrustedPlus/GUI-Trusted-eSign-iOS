import * as React from "react";
import { Container, Content, List, Text, Footer, FooterTab, View } from "native-base";
import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";
import { ListMenu } from "../components/ListMenu";
import { Headers } from "../components/Headers";
import { FooterButton } from "../components/FooterButton";
import { styles } from "../styles";
import * as Share from "react-native-share";
import { showToast, showToastDanger } from "../utils/toast";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { deleteRequests, selectedRequest, readRequests } from "../actions/requestAction";

function mapStateToProps(state) {
	return {
		requests: state.requests.arrRequests,
		lengthSelectedRequests: state.requests.lengthSelectedRequests
	};
}

function mapDispatchToProps(dispatch) {
	return {
		deleteRequests: bindActionCreators(deleteRequests, dispatch),
		selectedRequest: bindActionCreators(selectedRequest, dispatch),
		readRequests: bindActionCreators(selectedRequest, dispatch)
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

const options = {
	year: "numeric", month: "long", day: "numeric",
	hour: "numeric", minute: "numeric", second: "numeric"
};

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Requests extends React.Component<RequestsProps> {

	showList() {
		return (
			this.props.requests.map((file, key) => <ListMenu
				key={key + file.time}
				title={file.name}
				note={new Date(file.time).toLocaleString("ru", options)}
				img={require("../../imgs/general/file_csr.png")}
				selected={file.isSelected}
				nav={() => this.props.selectedRequest(key)} />));
	}

	onPressGetRequestInfo(requests) {
		requests.forEach((item, i, arr) => {
			if (item.isSelected) {
				NativeModules.Wrap_CertRequest.getRequestInfo(
					RNFS.DocumentDirectoryPath + "/Requests/" + item.name + ".csr",
					"BASE64",
					(err, verify) => {
						this.props.navigation.navigate("CreateCertificate", { requestsProperties: verify, clearSelectesRequests: () => this.setState({ selectedRequests: [] }) });
					}
				);
			}
		});
	}

	uploadFile(requests) {
		let arrUrls = [];
		requests.forEach((item, i, arr) => {
			if (item.isSelected) {
				arrUrls.push(RNFS.DocumentDirectoryPath + "/Requests/" + item.name + ".csr");
				this.props.selectedRequest(i);
				this.getRequestsView(requests);
			}
		});
		const shareOptions = {
			urls: arrUrls,
		};
		Share.open(shareOptions)
			.then((res) => {
				showToast("Запросы успешно экспортированы");
			})
			.catch((err) => {
				if (!(err.error.message === "Операция отменена." || err.error === "User did not share")) {
					showToastDanger("При экспорте произошла ошибка");
				}
			});
	}

	getRequestsView(requests) {
		if (requests.length) {
			return (
				<Content>
					<List>{this.showList()}</List>
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
		let filesView = this.getRequestsView(this.props.requests);
		return (
			<Container style={styles.container}>
				<Headers title="Запросы" goBack={() => goBack()} />
				{filesView}
				{this.props.lengthSelectedRequests ?
					<Footer>
						<FooterTab>
							<FooterButton title="Создать запрос по шаблону"
								disabled={this.props.lengthSelectedRequests !== 1}
								img={require("../../imgs/ios/question_cert.png")}
								nav={() => this.onPressGetRequestInfo(this.props.requests)} />
							<FooterButton title="Отправить"
								img={require("../../imgs/ios/posted.png")}
								nav={() => this.uploadFile(this.props.requests)} />
							<FooterButton title="Удалить"
								img={require("../../imgs/ios/delete.png")}
								nav={() => this.props.deleteRequests(this.props.requests)} />
						</FooterTab>
					</Footer> : null}
			</Container>
		);
	}
}