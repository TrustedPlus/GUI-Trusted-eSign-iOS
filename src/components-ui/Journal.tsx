import * as React from "react";
import { Container, Content, Text, Footer, FooterTab, List, ListItem, Left, Button, Icon, Body, Right, Spinner, Header, Title } from "native-base";
import { Image, View } from "react-native";
import { Headers } from "../components/Headers";
import { FooterButton } from "../components/FooterButton";
import { styles } from "../styles";
import * as Modal from "react-native-modalbox";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clearLog } from "../actions";

function mapStateToProps(state) {
	return {
		filter: state.filter,
		log: state.logger.log
	};
}

function mapDispatchToProps(dispatch) {
	return {
		clearLog: bindActionCreators(clearLog, dispatch)
	};
}

interface JournalProps {
	navigation: any;
	goBack: void;
	log: any;
	filter: IFilter;
	clearLog(): void;
}

interface JournalState {
	loadingJournal: boolean;
}

interface ISelectedFilters {
	sign: boolean;
	addSign: boolean;
	enc: boolean;
	dec: boolean;
	createRequest: boolean;
	installCert: boolean;
	deleteCert: boolean;
	addFile: boolean;
	deleteFile: boolean;
}

interface IFilter {
	filterEnabled: boolean;
	SelectedFilters: ISelectedFilters;
	filename: string;
	data1: any;
	data2: any;
}

const optionsTime = {
	hour: "numeric", minute: "numeric", second: "numeric"
};

const optionsData = {
	year: "numeric", month: "long", day: "numeric",
};

interface IModals {
	basicModal: Modal.default;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Journal extends React.Component<JournalProps, JournalState> {

	private modals: IModals = {
		basicModal: null
	};

	constructor(props) {
		super(props);

		this.state = {
			loadingJournal: false
		};
	}

	showList() {
		const { filter } = this.props;
		let showData = false;
		let lastData = null;
		return (
			this.props.log.map((log, key) => {
				if (filter.filterEnabled) {
					if (filter.filename !== "") {
						if (log.name.toUpperCase().indexOf(filter.filename.toUpperCase()) === -1) {
							return null;
						}
					}
					if (new Date(filter.data1).getTime() > new Date(log.now).getTime()) {
						return null;
					}
					if (new Date(filter.data2).getTime() < new Date(log.now).getTime()) {
						return null;
					}
					if (filter.SelectedFilters.sign || filter.SelectedFilters.addSign || filter.SelectedFilters.enc
						|| filter.SelectedFilters.dec || filter.SelectedFilters.createRequest || filter.SelectedFilters.installCert
						|| filter.SelectedFilters.deleteCert || filter.SelectedFilters.addFile || filter.SelectedFilters.deleteFile) {
						let showThisLog = false;
						if (filter.SelectedFilters.sign) {
							if (log.record === "Подпись") { showThisLog = true; }
						}
						if (filter.SelectedFilters.addSign) {
							if (log.record === "Добавление\nподписи") { showThisLog = true; }
						}
						if (filter.SelectedFilters.enc) {
							if (log.record === "Шифрование") { showThisLog = true; }
						}
						if (filter.SelectedFilters.dec) {
							if (log.record === "Расшифрование") { showThisLog = true; }
						}
						if (filter.SelectedFilters.createRequest) {
							if (log.record === "Запрос на\nсертификат") { showThisLog = true; }
						}
						if (filter.SelectedFilters.installCert) {
							if (log.record === "Установка\nсертификата") { showThisLog = true; }
						}
						if (filter.SelectedFilters.deleteCert) {
							if (log.record === "Удаление\nсертификата") { showThisLog = true; }
						}
						if (filter.SelectedFilters.addFile) {
							if (log.record === "Добавление\nфайла") { showThisLog = true; }
						}
						if (filter.SelectedFilters.deleteFile) {
							if (log.record === "Удаление\nфайла") { showThisLog = true; }
						}
						if (!showThisLog) {
							return null;
						}
					}
				}
				if (lastData === null) {
					showData = true;
					lastData = new Date(log.now).toLocaleString("ru", optionsData);
				} else {
					if (lastData === new Date(log.now).toLocaleString("ru", optionsData)) {
						showData = false;
					} else {
						lastData = new Date(log.now).toLocaleString("ru", optionsData);
						showData = true;
					}
				}
				return (
					<View key={key}>
						{showData ? <View style={{ paddingLeft: 20, paddingTop: 20 }}>
							<Text style={{ fontWeight: "600" }}>{new Date(log.now).toLocaleString("ru", optionsData)}</Text>
						</View> : null}
						<ListItem icon >
							<Left>
								<Button transparent primary>
									{log.status
										? <Image style={{ width: 25, height: 25 }} source={require("../../imgs/ios/ok.png")} />
										: <Image style={{ width: 25, height: 25 }} source={require("../../imgs/ios/error.png")} />}
								</Button>
							</Left>
							<Body>
								<Text style={{ fontSize: 13 }}>{new Date(log.now).toLocaleString("ru", optionsTime) + " " + log.name}</Text>
							</Body>
							<Right>
								<Text style={{ fontSize: 13 }}>{log.record}</Text>
							</Right>
						</ListItem>
					</View>);
			}));
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		const { log, clearLog } = this.props;
		return (
			<Container>
				<Headers
					title="Журнал операций"
					goBack={() => goBack()}
					imgRight={this.props.filter.filterEnabled ? require("../../imgs/general/filter_on.png") : require("../../imgs/general/filter_off.png")}
					goRight={() => navigate("FilterJournal")} />
				{this.state.loadingJournal
					? log.length
						? <Content>
							<List style={{ backgroundColor: "white" }}>{this.showList()}</List>
						</Content>
						: <Content>
							<Text style={[styles.sign_enc_prompt, { paddingTop: "50%" }]}>Журнал чист</Text>
						</Content>
					: <View style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "90%",
						backgroundColor: "white"
					}}>
						<Spinner color={"#be3817"} />
					</View>
				}
				<Modal
					ref={ref => this.modals.basicModal = ref}
					style={[styles.modal, {
						height: "auto",
						width: 300,
						backgroundColor: "white",
					}]}
					position={"center"}
					swipeToClose={false}>
					<View style={{ width: "100%" }}>
						<Header
							style={{ backgroundColor: "#be3817", height: 45.7, paddingTop: 13 }}>
							<Title>
								<Text style={{
									color: "white",
									fontSize: 15
								}}>Очистка журнала</Text>
							</Title>
						</Header>
						<View style={{
							padding: 15, height: 70
						}}>
							<Text style={{
								color: "grey",
								fontSize: 15
							}}>Выполнить удаление всех записей операций?</Text>
						</View>
						<View style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-around", maxWidth: "100%" }}>
							<Button transparent style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "50%", borderLeftWidth: 0.25, borderTopWidth: 0.5, borderColor: "grey", borderRadius: 0 }} onPress={() => this.modals.basicModal.close()}>
								<Text style={{ fontSize: 15, textAlign: "center", color: "grey" }}>Отмена</Text>
							</Button>
							<Button transparent style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "50%", borderLeftWidth: 0.25, borderTopWidth: 0.5, borderColor: "grey", borderRadius: 0 }} onPress={() => { this.modals.basicModal.close(); clearLog(); }}>
								<Text style={{ fontSize: 15, textAlign: "center", color: "grey" }}>Да</Text>
							</Button>
						</View>
					</View>
				</Modal>
				<Footer>
					<FooterTab>
						<FooterButton title="Очистить" icon="md-trash" nav={() => this.modals.basicModal.open()} />
					</FooterTab>
				</Footer>
			</Container>
		);
	}

	componentDidMount() {
		setTimeout(
			() => this.setState({ loadingJournal: true }), 1
		);
	}
}