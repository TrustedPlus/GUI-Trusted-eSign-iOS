import * as React from "react";
import {Footer, FooterTab, Button, Icon, Text} from "native-base";
import {styles} from "../styles";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {signFiles} from "../actions/index";

interface FooterSignStore {
    signFiles(any): void;
}

class FooterSign extends React.Component<any, FooterSignStore> {
    render() {
        return(
            <Footer>
                <FooterTab style={styles.container}>
                <Button vertical>
                    <Icon style={{color: "black"}} name="apps" />
                    <Text style={{color: "black", width: 110}}>Проверить</Text>
                </Button>
                <Button vertical onPress={() => this.props.signFiles(this.props.footer.arrButton)}>
                    <Icon style={{color: "black"}} name="camera" />
                    <Text style={{color: "black", width: 110}}>Подписать</Text>
                </Button>
                <Button vertical>
                    <Icon style={{color: "black"}} name="navigate" />
                    <Text style={{color: "black",  width: 110}}>Отправить</Text>
                </Button>
                <Button vertical>
                    <Icon style={{color: "black"}} name="person" />
                    <Text style={{color: "black"}}>Удалить</Text>
                </Button>
                </FooterTab>
            </Footer>
        );
    }
}

function mapStateToProps (state) {
    return {
      files: state.files,
      footer: state.footer
    };
}

function mapDispatchToProps (dispatch) {
    return {
        signFiles: bindActionCreators(signFiles, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FooterSign);