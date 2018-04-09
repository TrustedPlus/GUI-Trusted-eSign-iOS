import * as React from "react";
import { Container, Text, Footer, FooterTab, Button, Icon } from "native-base";
import { ScrollView } from "react-native";
import { Headers } from "./Headers";
import { styles } from "../styles";
import { connect } from "react-redux";
import { clearLog } from "../actions/index";
import { bindActionCreators } from "redux";

interface JournalProps {
    navigation: any;
    goBack: void;
    log: any;
    clearLog(): void;
}

class Journal extends React.Component<JournalProps> {

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
                <ScrollView>{this.showList()}</ScrollView>
                <Footer>
                    <FooterTab>
                        <Button vertical>
                            <Text onPress={() => clearLog()} style={{ color: "black" }}>Очистить</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }

    componentDidMount() {
        if (this.props.log.length !== 0) { this.showList(); }
    }
}

function mapStateToProps(state) {
    return {
        log: state.files.log
    };
}

function mapDispatchToProps(dispatch) {
    return {
        clearLog: bindActionCreators(clearLog, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Journal);