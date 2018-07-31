import * as React from "react";
import { Container, Content, List, Text, Footer, FooterTab, View, Button } from "native-base";
import { Headers } from "../components/Headers";
import { NativeModules } from "react-native";
import { ListMenu } from "../components/ListMenu";
import { styles } from "../styles";
import { showToast } from "../utils/toast";
import { FooterButton } from "../components/FooterButton";
import * as Modal from "react-native-modalbox";
import { ListWithSwitch } from "../components/ListWithSwitch";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getProviders } from "../actions/getContainersAction";

function mapStateToProps(state) {
	return {
		containers: state.containers.containers,
		providers: state.containers.providers
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
	providers: any;
	getProviders(): void;
}

interface ContainersState {
	selectedContainers: any;
	deleteCert: boolean;
}

interface IModals {
	basicModal: Modal.default;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Containers extends React.Component<ContainersProps, ContainersState> {

	static navigationOptions = {
		header: null
	};

	private modals: IModals = {
		basicModal: null
	};

	constructor(props) {
		super(props);

		this.state = {
			selectedContainers: [],
			deleteCert: true
		},
			this.props.navigation.state.key = "Home";
	}

	changeSelectedContainers(oldSelectedContainers, key) {

		let index = oldSelectedContainers.indexOf(key);
		if (index !== -1) {
			oldSelectedContainers.splice(index, 1); // удаление из массива
			return oldSelectedContainers;
		}
		oldSelectedContainers.push(key);
		return oldSelectedContainers; // добавление в массив
	}

	showList() {
		if (this.props.containers[0]) {
			return (this.props.containers.map((containers, key) => <ListMenu
				key={key}
				note={"HDIMAGE"}
				title={containers.container}
				img={require("../../imgs/general/key_icon.png")}
				checkbox
				nav={() => this.setState({ selectedContainers: this.changeSelectedContainers(this.state.selectedContainers, key) })} />
			));
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
				{this.state.selectedContainers.length ?
					<Footer>
						<FooterTab>
							<FooterButton disabled={this.state.selectedContainers.length !== 1} title="Сертификат" icon="create" nav={
								() => NativeModules.Wrap_Main.getCertInfoFromContainer(
									this.props.containers[this.state.selectedContainers]["unique"],
									(err, cert) => {
										if (err) {
											console.log(err);
											showToast("В контейнере нет сертификата");
										} else {
											this.props.navigation.navigate("PropertiesCert", { cert: cert[0], isCertInContainers: true, containers: this.props.containers[this.state.selectedContainers]["fqcnA"] });
										}
									})} />
							{/*<FooterButton disabled={this.state.selectedContainers.length !== 1} title="Экспорт" icon="ios-share-alt-outline" nav={() => /*this.uploadFile(this.props.containers, this.state.selectedContainers) null} />*/}
							<FooterButton title="Удалить" icon="md-trash" nav={() => this.modals.basicModal.open()} />
						</FooterTab>
					</Footer> : null}
				<Modal
					ref={ref => this.modals.basicModal = ref}
					style={[styles.modal, styles.modal3]}
					position={"center"}
					swipeToClose={false}>
					<View style={{ width: "100%", height: "100%" }}>
						<ListWithSwitch text="Удалить по возможности вместе с сертификатом" value={this.state.deleteCert} changeValue={() => this.setState({ deleteCert: !this.state.deleteCert })} />
						<Button transparent onPressIn={() => {
							this.modals.basicModal.close();
							for (let i = 0; i < this.state.selectedContainers.length; i++) {
								NativeModules.Wrap_Main.deleteContainer(
									this.props.containers[this.state.selectedContainers[i]]["unique"],
									this.props.providers[0]["type"],
									this.props.providers[0]["name"],
									this.state.deleteCert,
									(err, verify) => {
										if (verify) {
											showToast("Контейнер удален");
										} else {
											showToast("Ошибка при удалении контейнера");
										}
									});
								if (i === this.state.selectedContainers.length - 1) {
									this.setState({ selectedContainers: [] });
									this.props.getProviders();
								}
							}
						}} style={{ borderTopWidth: 1, borderRightWidth: 1, borderRadius: 0, borderColor: "#BABABA", width: "50%", height: "20%", position: "absolute", bottom: 0 }}>
							<Text style={{ color: "#007AFF", fontWeight: "bold", textAlign: "center", width: "100%" }}>ОК</Text>
						</Button>
						<Button transparent onPressIn={() => this.modals.basicModal.close()} style={{ borderTopWidth: 1, borderRadius: 0, borderColor: "#BABABA", width: "50%", height: "20%", position: "absolute", bottom: 0, right: 0 }}><Text style={{ color: "#007AFF", fontWeight: "bold", textAlign: "center", width: "100%" }}>Отмена</Text></Button>
					</View>
				</Modal>
			</Container>
		);
	}

	componentDidMount() {
		this.props.getProviders();
	}
}