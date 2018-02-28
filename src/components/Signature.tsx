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
/*
interface IFile {
  id: number[];
  type: string[];
  note: string[];
  extension: string[];
  title: string[];
}*/

interface SignatureProps {
  navigation: any;
  footer: any;
  certificate: any;
  files: any;
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

  /*showList(img) {
    this.props.files.map((file, key) => {
      return (
        <List>
          <ListMenu
          key={key}
          id={file.id}
          title={file.title}
          note={file.note}
          img = {img[key]}
          checkbox nav={() => footerAction(file.id)} />
        </List>
      );
    });
  }*/

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
    for (let i = 0; i < files.id.length; i++) { // какое расширение у файлов
      switch (files.extension[i]) {
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
          break;
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
    console.log(this.props);
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
          {/*this.showList(img)*/}
          <List>
            <ListMenu id={files.id[0]} title={files.title[0]} img={img[0]}
              note={files.note[0]} checkbox nav={() => footerAction(files.id[0])}/>
            <ListMenu id={files.id[1]} title={files.title[1]} img={img[1]}
              note={files.note[1]} checkbox nav={() => footerAction(files.id[1])}/>
            <ListMenu id={files.id[2]} title={files.title[2]} img={img[2]}
              note={files.note[2]} checkbox nav={() => footerAction(files.id[2])}/>
            <ListMenu iid={files.id[3]} title={files.title[3]} img={img[3]}
              note={files.note[3]} checkbox nav={() => footerAction(files.id[3])}/>
            <ListMenu iid={files.id[4]} title={files.title[4]} img={img[4]}
              note={files.note[4]} checkbox nav={() => footerAction(files.id[4])}/>
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
    files: state.files,
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