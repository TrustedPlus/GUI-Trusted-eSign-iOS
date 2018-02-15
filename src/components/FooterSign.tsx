import * as React from "react";
import {Footer, FooterTab, Button, Icon, Text} from "native-base";

import {bindActionCreators} from "redux";
import { connect } from "react-redux";
import {signFiles} from "../actions/index";

interface FooterSignStore {
    signFiles(any): void;
}

class FooterSign extends React.Component<any, FooterSignStore> {
    render() {
        return(
            <Footer>
                <FooterTab>
                <Button vertical>
                    <Icon name="apps" />
                    <Text>Проверить</Text>
                </Button>
                <Button vertical onPress={() => this.props.signFiles(this.props.footer.arrButton)}>
                    <Icon name="camera" />
                    <Text>Подписать</Text>
                </Button>
                <Button vertical>
                    <Icon name="navigate" />
                    <Text>Отправить</Text>
                </Button>
                <Button vertical>
                    <Icon name="person" />
                    <Text >Закрыть</Text>
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