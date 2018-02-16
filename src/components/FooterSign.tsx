import * as React from "react";
import {Footer, FooterTab, Button, Icon, Text} from "native-base";
import {styles} from "../styles";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {signFiles, encryptFiles} from "../actions/index";

interface FooterSignProps {
    encrypt?: boolean;
    sign?: boolean;
    footer: any;
    signFiles(any): void;
    encryptFiles(any): void;
}

class FooterSign extends React.Component<FooterSignProps> {
    render() {
        let footer = null;
        if (this.props.encrypt) { // если футер для мастера шифрования
            footer = <FooterTab style={styles.container}>
                    <Button vertical onPress={() => this.props.encryptFiles(this.props.footer.arrButton)}>
                        <Icon style={{color: "black"}} name="apps" />
                        <Text style={{color: "black", width: 130}}>Зашифровать</Text>
                    </Button>
                    <Button vertical>
                        <Icon style={{color: "black"}} name="camera" />
                        <Text style={{color: "black", width: 130}}>Архивировать</Text>
                    </Button></FooterTab>;
        }
        if (this.props.sign) { // если футер для мастера подписи
            footer = <FooterTab style={styles.container}>
                    <Button vertical>
                        <Icon style={{color: "black"}} name="apps" />
                        <Text style={{color: "black", width: 110}}>Проверить</Text>
                    </Button>
                    <Button vertical onPress={() => this.props.signFiles(this.props.footer.arrButton)}>
                        <Icon style={{color: "black"}} name="camera"/>
                        <Text style={{color: "black", width: 110}}>Подписать</Text>
                    </Button></FooterTab>;
        }
        return(
            <Footer>
                {footer}
                <FooterTab style={styles.container}>
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
        signFiles: bindActionCreators(signFiles, dispatch),
        encryptFiles: bindActionCreators(encryptFiles, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FooterSign);