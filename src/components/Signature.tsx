import * as React from "react";
import { Container, View, List, Content, Button, Body, Text } from "native-base";
import { StyleSheet, TouchableOpacity, TouchableHighlight, Image } from "react-native";
import { Headers } from "./Headers";
import { styles } from "../styles";
import SelectСert from "./SelectСert";
import ListMenu from "./ListMenu";
import FooterSign from "./FooterSign";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { footerAction, footerClose, readFiles } from "../actions/index";
import { readCertKeys} from "../actions/CertKeysAction";

interface IFile {
  mtime: string;
  extension: string;
  name: string;
}

interface SignatureProps {
  navigation: any;
  footer: any;
  certificate: any;
  files: IFile[];
  certKeys: any;
  footerAction(any): void;
  footerClose(): void;
  readFiles(): void;
  readCertKeys(): void;
}

class Signature extends React.Component<SignatureProps> {

  static navigationOptions = {
    header: null
  };

  ShowList(img) {
    return (
      this.props.files.map((file, key) => <ListMenu
        key = {key}
        title={file.name}
        note = {file.mtime}
        img = {img[key]}
        checkbox
        nav={() => this.props.footerAction(key)} />));
  }

  componentWillMount() {
    this.props.readFiles();
  }

  render() {
    const { footerAction, footerClose, files, readFiles, readCertKeys} = this.props;
    const { navigate, goBack } = this.props.navigation;

    let certificate, icon;
    if (this.props.certificate.title) { // выбран ли сертификат
      certificate = <List>
        <ListMenu title={this.props.certificate.title} img={this.props.certificate.img}
          note={this.props.certificate.note} nav={() => null} />
      </List>;
      icon = require("../../imgs/general/edit_icon.png");
    } else {
      certificate = <Body><View style={styles.sign_enc_view}>
        <Text style={styles.sign_enc_prompt}>[Добавьте сертификат подписчика]</Text>
      </View></Body>;
      icon = require("../../imgs/general/add_icon.png");
    }

    let img = [];
    for (let i = 0; i < files.length; i++) { // какое расширение у файлов
      switch (files[i].extension) {
        case "pdf":
          img[i] = require("../../imgs/general/file_pdf.png"); break;
        case "txt":
          img[i] = require("../../imgs/general/file_txt.png"); break;
        case "zip":
          img[i] = require("../../imgs/general/file_zip.png"); break;
        case "docx":
          img[i] = require("../../imgs/general/file_docx.png"); break;
        case "sig":
          img[i] = require("../../imgs/general/file_sig.png"); break;
        case "enc":
          img[i] = require("../../imgs/general/file_enc.png"); break;
        default:
          img[i] = require("../../imgs/general/file_pdf.png"); break;
      }
    }

    let footer, selectFiles = null;
    if (this.props.footer.arrButton.length) { // выбраны ли файлы
      footer = <FooterSign sign />;
      selectFiles = <Text style={{ fontSize: 17, height: 20, color: "grey", width: "70%" }}>
        выбран(о) {this.props.footer.arrButton.length} файл(ов)</Text>;
    } else {
      selectFiles = <Text style={{ height: 20 }} ></Text>;
    }

    return (
      <Container style={styles.container}>
        <Headers title="Подпись/проверка" goBack={() => { goBack(); footerClose(); }} />
        <Content>
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_title}>Сертификат подписи</Text>
            <Button transparent onPress={() => { readCertKeys(); navigate("SelectСert"); }} style={styles.sign_enc_button}>
              <Image style={styles.headerImage} source={icon} />
            </Button>
          </View>
          {certificate}
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_title}>Файлы</Text>
            {selectFiles}
            <Button transparent style={styles.sign_enc_button} onPress={() => readFiles()} >
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")} />
            </Button>
          </View>
          <List>
            {this.ShowList(img)}
          </List>
        </Content>
        {footer}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    footer: state.footer,
    certificate: state.certificate,
    files: state.files.files,
    certKeys: state.certKeys
  };
}

function mapDispatchToProps(dispatch) {
  return {
    footerAction: bindActionCreators(footerAction, dispatch),
    footerClose: bindActionCreators(footerClose, dispatch),
    readFiles: bindActionCreators(readFiles, dispatch),
    readCertKeys: bindActionCreators(readCertKeys, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signature);