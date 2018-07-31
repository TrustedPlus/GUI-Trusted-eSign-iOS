import * as React from "react";
import { Container, Content, Text, Footer, FooterTab, List, ListItem, Left, Button, Icon, Body, Right } from "native-base";
import { ScrollView } from "react-native";
import { Headers } from "../components/Headers";
import { FooterButton } from "../components/FooterButton";
import { styles } from "../styles";

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

const options = {
	hour: "numeric", minute: "numeric", second: "numeric"
};

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Journal extends React.Component<JournalProps> {

	static navigationOptions = {
		header: null
	};

	showList() {
		const { filter } = this.props;
		return (
			this.props.log.map((log, key) => {
				if (filter.filterEnabled) {
					if (filter.filename !== "") {
						if (log.name.indexOf(filter.filename) === -1) {
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
				return (
					<ListItem icon key={key}>
						<Left>
							<Button transparent primary>
								{log.status ? <Icon active style={{ color: "green" }} name="md-checkmark" /> : <Icon style={{ color: "red" }} active name="md-close" />}
							</Button>
						</Left>
						<Body>
							<Text style={{ fontSize: 13 }}>{new Date(log.now).toLocaleString("ru", options) + " " + log.name}</Text>
						</Body>
						<Right>
							<Text style={{ fontSize: 13 }}>{log.record}</Text>
						</Right>
					</ListItem>);
			}));
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		const { log, clearLog } = this.props;
		return (
			<Container>
				<Headers title="Журнал операций" goBack={() => goBack()} filterEnabled={this.props.filter.filterEnabled} iconRight={"ios-cog"} goRight={() => navigate("FilterJournal")} />
				<Content>
					{log.length
						? <List style={{ backgroundColor: "white" }}>{this.showList()}</List>
						: <Text style={[styles.sign_enc_prompt, { paddingTop: "50%" }]}>Журнал чист</Text>}
				</Content>
				<Footer>
					<FooterTab>
						<FooterButton title="Очистить" icon="md-trash" nav={() => clearLog()} />
					</FooterTab>
				</Footer>
			</Container>
		);
	}
}