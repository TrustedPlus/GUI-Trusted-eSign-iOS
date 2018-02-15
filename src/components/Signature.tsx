import * as React from "react";
import { Container, View, List, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {StyleSheet, TouchableOpacity, TouchableHighlight, Image} from "react-native";
import {Headers} from "./Headers";
import {styles} from "../styles";
import {SelectСert} from "./SelectСert";
import ListMenu from "./ListMenu";
import FooterSign from "./FooterSign";

import {bindActionCreators} from "redux";
import { connect } from "react-redux";
import {footerAction, footerClose} from "../actions/index";

interface SignatureProps {
  navigation: any;
  footer: any;
  certificate: any;
  files: any;
  footerAction(any): void;
  footerClose(): void;
}

class Signature extends React.Component<SignatureProps, any> {

  static navigationOptions = {
    header: null
  };

  render() {
    const {footerAction, footerClose, files} = this.props;
    const { navigate, goBack } = this.props.navigation;

    let footer = null;
    let selectFiles = <Text style={{height: 20}} ></Text>;
    if (this.props.footer.arrButton.length) { // выбраны ли файлы
      footer = <FooterSign/>;
      selectFiles = <Text style={{fontSize: 17, height: 20, color: "grey", width: "70%"}}>
      выбран(о) {this.props.footer.arrButton.length} файл(ов)</Text>;
    }

    let certificate, icon;
    if (this.props.certificate.title) { // выбран ли сертификат
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

    let img = [];
    for (let i = 0; i < files.id.length; i++) {
      switch (files.extension[i]) {
        case "pdf":
          img[i] = require("../../imgs/general/file_pdf.png");
          break;
        case "txt":
          img[i] = require("../../imgs/general/file_txt.png");
          break;
        case "zip":
          img[i] = require("../../imgs/general/file_zip.png");
          break;
        case "docx":
          img[i] = require("../../imgs/general/file_docx.png");
          break;
        case "sig":
          img[i] = require("../../imgs/general/file_sig.png");
          break;
        default:
          break;
      }
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
            {selectFiles}
            <Button transparent style={{position: "absolute", marginTop: 6, right: 10}}>
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")}/>
            </Button>
          </View>
            <List>
              <ListMenu id={files.id[0]} title={files.title[0]} img={img[0]}
              note={files.note[0]} checkbox nav={() => footerAction(files.id[0])}/>
              <ListMenu id={files.id[1]} title={files.title[1]} img={img[1]}
              note={files.note[1]} checkbox nav={() => footerAction(files.id[1])}/>
              <ListMenu id={files.id[2]} title={files.title[2]} img={img[2]}
              note={files.note[2]} checkbox nav={() => footerAction(files.id[2])}/>
              <ListMenu iid={files.id[3]} title={files.title[3]} img={img[3]}
              note={files.note[3]} checkbox nav={() => footerAction(files.id[3])}/>
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
    certificate: state.certificate,
    files: state.files
  };
}

function mapDispatchToProps (dispatch) {
  return {
    footerAction: bindActionCreators(footerAction, dispatch),
    footerClose: bindActionCreators(footerClose, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signature);