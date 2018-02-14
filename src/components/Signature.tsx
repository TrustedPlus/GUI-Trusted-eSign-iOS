import * as React from "react";
import { Container, View, List, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {StyleSheet, TouchableOpacity, TouchableHighlight, Image} from "react-native";
import {Headers} from "./Headers";
import {styles} from "../styles";
import {SelectСert} from "./SelectСert";
import ListMenu from "./ListMenu";
import {FooterSign} from "./FooterSign";

import {bindActionCreators} from "redux";
import { connect } from "react-redux";
import {footerAction, footerClose} from "../actions/index";

interface SignatureProps {
  navigation: any;
  footer: any;
  certificate: any;
  footerAction(any): void;
  footerClose(): void;
}

class Signature extends React.Component<SignatureProps, any> {

  static navigationOptions = {
    header: null
  };

  render() {
    const {footerAction, footerClose} = this.props;
    const { navigate, goBack } = this.props.navigation;

    let footer = null;
    if (this.props.footer.arrButton.length) {
      footer = <FooterSign/>;
    }

    let certificate, icon;
    if (this.props.certificate.title) {
      certificate = <List>
                      <ListMenu title={this.props.certificate.title} img={this.props.certificate.img}
                        note={this.props.certificate.note} nav={() => null}/>
                    </List>;
      icon = require("../../imgs/general/edit_icon.png");
    } else  {
      certificate = <Body><View style={[styles.sign_view, {paddingBottom: 40}]}>
                      <Text style={{fontSize: 17, color: "lightgrey"}}>[Добавьте сертификат подписчика]</Text>
                    </View></Body>;
      icon = require("../../imgs/general/add_icon.png");
          }
    return (
      <Container>
        <Headers title="Подпись/проверка" goBack={() => {goBack(); footerClose(); }}/>
        <Content style={{backgroundColor: "white"}}>
          <View style={styles.sign_view}>
            <Text style={{fontSize: 23, color: "grey", width: "80%"}}>Сертификат подписи</Text>
            <Button transparent onPress={() => navigate("SelectСert")} style={{position: "absolute", marginTop: 6, right: 10}}>
              <Image style={styles.headerImage} source={icon}/>
            </Button>
          </View>
          {certificate}
          <View style={styles.sign_view}>
            <Text style={{fontSize: 23, color: "grey", width: "70%"}}>Файлы</Text>
            <Button transparent style={{position: "absolute", marginTop: 6, right: 10}}>
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")}/>
            </Button>
          </View>
            <List>
              <ListMenu id={1} title="Договор №2332" img={require("../../imgs/general/file_pdf.png")}
              note="12 января 2018, 02:34:22" checkbox nav={() => footerAction(1)}/>
              <ListMenu id={2} title="Письмо от 23.08.2018" img={require("../../imgs/general/file_txt.png")}
              note="12 января 2018, 02:36:38" checkbox nav={() => footerAction(2)}/>
              <ListMenu id={3} title="Договор №2332 с приложениями" img={require("../../imgs/general/file_zip.png")}
              note="6 января 2018, 13:49:26" checkbox nav={() => footerAction(3)}/>
              <ListMenu id={4} title="Заключение от поставке" img={require("../../imgs/general/file_docx.png")}
              note="6 января 2018, 14:28:18" checkbox nav={() => footerAction(4)}/>
            </List>
        </Content>
        {footer}
      </Container>
    );
  }
}

function mapStateToProps (state) {
  return {
    footer: state.footer,
    certificate: state.certificate
  };
}

function mapDispatchToProps (dispatch) {
  return {
    footerAction: bindActionCreators(footerAction, dispatch),
    footerClose: bindActionCreators(footerClose, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signature);