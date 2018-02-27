import * as React from "react";
import {Container, View, Content, Button, Body, Text, List} from "native-base";
import {Image} from "react-native";
import {Headers} from "./Headers";
import {styles} from "../styles";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {footerAction, footerClose} from "../actions/index";
import ListMenu from "./ListMenu";
import FooterSign from "./FooterSign";

interface EncryptionProps {
  navigation: any;
  footer: any;
  files: any;
  footerAction(any): void;
  footerClose(): void;
}

class Encryption extends React.Component<EncryptionProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    const {footerAction, footerClose, files} = this.props;
    const { navigate, goBack } = this.props.navigation;

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
        case "sgn":
          img[i] = require("../../imgs/general/file_sig.png"); break;
        case "enc":
          img[i] = require("../../imgs/general/file_enc.png"); break;
        default:
          break;
      }
    }

    let footer, selectFiles = null;
    if (this.props.footer.arrButton.length) { // выбраны ли файлы
      footer = <FooterSign encrypt/>;
      selectFiles = <Text style={{fontSize: 17, height: 20, color: "grey"}}>
       выбран(о) {this.props.footer.arrButton.length} файл(ов)</Text>;
    } else {
      selectFiles = <Text style={{height: 20}} ></Text>;
    }

    return (
      <Container style={styles.container}>
        <Headers title="Шифрование/расшифрование" goBack={() => {goBack(); footerClose(); }}/>
        <Content>
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_title}>Сертификаты получателей</Text>
            <Button transparent style={styles.sign_enc_button}>
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")}/>
            </Button>
          </View>
          <Body>
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_prompt}>[Добавьте сертификаты получателей]</Text>
          </View>
          </Body>
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_title}>Файлы</Text>
            {selectFiles}
            <Button transparent style={styles.sign_enc_button}>
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
    files: state.files
  };
}

function mapDispatchToProps (dispatch) {
  return {
    footerAction: bindActionCreators(footerAction, dispatch),
    footerClose: bindActionCreators(footerClose, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Encryption);