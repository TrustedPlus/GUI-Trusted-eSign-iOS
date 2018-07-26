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
			this.props.log.map((log, key) => <ListItem icon key={key}>
				<Left>
					<Button transparent primary>
						{log.status ? <Icon active style={{color: "green"}} name="md-checkmark" /> : <Icon style={{color: "red"}} active name="md-close" />}
					</Button>
				</Left>
				<Body>
					<Text style={{fontSize: 13}}>{log.now + " " + log.name}</Text>
				</Body>
				<Right>
					<Text style={{fontSize: 13}}>{log.record}</Text>
				</Right>
			</ListItem>));
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		const { log, clearLog } = this.props;
		return (
			<Container>
				<Headers title="Журнал операций" goBack={() => goBack()} />
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