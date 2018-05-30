import * as React from "react";
import { Container, Content, Text, Footer, FooterTab, Button } from "native-base";
import { ScrollView } from "react-native";
import { Headers } from "../components/Headers";
import { FooterButton } from "../components/FooterButton";
import { styles } from "../styles";
import { connect } from "react-redux";
import { clearLog } from "../actions/index";
import { bindActionCreators } from "redux";

function mapStateToProps(state) {
	return {
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
	clearLog(): void;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Journal extends React.Component<JournalProps> {

	static navigationOptions = {
		header: null
	};

	showList() {
		return (
			this.props.log.map((log, key) => <Text key={key}>{log}</Text>));
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		const { log, clearLog } = this.props;
		return (
			<Container style={styles.container}>
				<Headers title="Журнал операций" goBack={() => goBack()} />
				<Content>
					{log.length ? <ScrollView>{this.showList()}</ScrollView> : <Text style={[styles.sign_enc_prompt, { paddingTop: "50%" }]}>Журнал чист</Text>}
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