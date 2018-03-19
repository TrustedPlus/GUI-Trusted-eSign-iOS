import * as React from "react";
import { Container, View, List, Content, Button, Body, Text } from "native-base";
import { Image, RefreshControl, ScrollView } from "react-native";
import { Headers } from "./Headers";
import { styles } from "../styles";
import SelectPersonalСert from "./SelectPersonalСert";
import ListMenu from "./ListMenu";
import FooterSign from "./FooterSign";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { footerAction, footerClose, readFiles, addFiles} from "../actions/index";
import { readCertKeys} from "../actions/CertKeysAction";
import { DocumentPicker, DocumentPickerUtil } from "react-native-document-picker";

interface IFile {
  extension: string;
  name: string;
  date: string;
  month: string;
  year: string;
  hours: string;
  minutes: string;
  seconds: string;
  verify: number;
}

interface SignatureProps {
  navigation: any;
  footer: any;
  personalCert: any;
  files: IFile[];
  certKeys: any;
  isFetching: boolean;
  footerAction(any): void;
  footerClose(): void;
  readFiles(): void;
  readCertKeys(string): void;
  addFiles(...any): void;
}

class Signature extends React.Component<SignatureProps> {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.showList = this.showList.bind(this);
    this.documentPicker = this.documentPicker.bind(this);
  }

  showList(img) {
    return (
      this.props.files.map((file, key) => <ListMenu
        key = {key + file.seconds}
        title={file.name}
        note = {file.date + " " + file.month + " " + file.year + ", " + file.hours + ":" + file.minutes + ":" + file.seconds}
        verify = {file.verify}
        img = {img[key]}
        checkbox
        nav={() => this.props.footerAction(key)} />));
  }

  documentPicker() {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()]
    }, (error: any, res: any) => {
      this.props.addFiles(res.uri, res.type, res.fileName, res.fileSize);
      /*console.log(
        res.uri,
        res.type, // mime type
        res.fileName,
        res.fileSize
      );*/
    });
  }

  render() {
    const { footerAction, footerClose, files, isFetching, readFiles, readCertKeys, personalCert} = this.props;
    const { navigate, goBack } = this.props.navigation;

    let certificate, icon;
    if (personalCert.title) { // выбран ли сертификат
      certificate = <List>
        <ListMenu title={personalCert.title} img={personalCert.img}
          note={personalCert.note} nav={() => null} />
      </List>;
      icon = require("../../imgs/general/edit_icon.png");
    } else {
      certificate = <View style={styles.sign_enc_view}>
        <Text style={styles.sign_enc_prompt}>[Добавьте сертификат подписчика]</Text>
      </View>;
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
      selectFiles = <Text style={{ fontSize: 17, height: 20, color: "grey", width: "70%" }}>
      всего файлов: {files.length}</Text>;
    }
    return (
      <Container style={styles.container}>
        <Headers title="Подпись/проверка" goBack={() => goBack()} />
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_title}>Сертификат подписи</Text>
            <Button transparent onPress={() => { readCertKeys("sig"); navigate("SelectPersonalСert"); }} style={styles.sign_enc_button}>
              <Image style={styles.headerImage} source={icon} />
            </Button>
          </View>
          {certificate}
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_title}>Файлы</Text>
            {selectFiles}
            <Button transparent style={styles.sign_enc_button} onPress={() => {this.documentPicker(); }}>
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")} />
            </Button>
          </View>
          <ScrollView refreshControl = {
            <RefreshControl refreshing={isFetching}
              onRefresh={() => readFiles()}
            />}>
            <List>{this.showList(img)}</List>
          </ScrollView>
        {footer}
      </Container>
    );
  }

  componentDidMount() {
    if (this.props.footer.arrButton.length !== 0) this.props.footerClose();
    if (this.props.files.length === 0) this.props.readFiles();
  }
}

function mapStateToProps(state) {
  return {
    footer: state.footer,
    personalCert: state.personalCert,
    files: state.files.files,
    isFetching: state.files.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    footerAction: bindActionCreators(footerAction, dispatch),
    footerClose: bindActionCreators(footerClose, dispatch),
    readFiles: bindActionCreators(readFiles, dispatch),
    readCertKeys: bindActionCreators(readCertKeys, dispatch),
    addFiles: bindActionCreators(addFiles, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signature);