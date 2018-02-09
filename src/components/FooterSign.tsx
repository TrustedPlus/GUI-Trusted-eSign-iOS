import * as React from "react";
import {bindActionCreators} from "redux";
import { connect } from "react-redux";
import {Footer, FooterTab, Button, Icon, Text} from "native-base";
import {getFooterOpen, getFooterClose} from "../actions/index";

interface FooterSignProps {
    getFooterOpen(): void;
    getFooterClose(): void;
}

class FooterSign extends React.Component<any, FooterSignProps> {
    render() {
        const {getFooterOpen, getFooterClose } = this.props;
        return(
            <Footer>
                <FooterTab>
                <Button vertical>
                    <Icon name="apps" />
                    <Text>Проверить</Text>
                </Button>
                <Button vertical>
                    <Icon name="camera" />
                    <Text>Подписать</Text>
                </Button>
                <Button vertical>
                    <Icon name="navigate" />
                    <Text>Отправить</Text>
                </Button>
                <Button vertical onPress={() => getFooterClose()} >
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
    appData: state.appData
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getFooterOpen: bindActionCreators(getFooterOpen, dispatch),
    getFooterClose: bindActionCreators(getFooterClose, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FooterSign);