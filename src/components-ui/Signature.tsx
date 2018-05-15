import * as React from "react";
import { Container, View, List, Content, Button, Body, Text } from "native-base";
import { Image, RefreshControl, ScrollView } from "react-native";
import { Headers } from "./Headers";
import { styles } from "../styles";
import { ListMenu } from "./ListMenu";
import { bindActionCreators } from "redux";
import { FooterSign } from "./FooterSign";
import { connect } from "react-redux";
import { footerAction, footerClose, readFiles, addFiles } from "../actions/index";
import { iconSelection } from "../utils/forListFiles";
import { readCertKeys } from "../actions/CertKeysAction";
import { DocumentPicker } from "react-native-document-picker";

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
   isFetching: boolean;
   footerAction(key: number, extension: string): void;
   footerClose(): void;
   readFiles(): void;
   readCertKeys(): void;
   addFiles(uri: string, fileName: string): void;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Signature extends React.Component<SignatureProps> {

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
            key={key + file.seconds}
            title={file.name}
            note={file.date + " " + file.month + " " + file.year + ", " + file.hours + ":" + file.minutes + ":" + file.seconds}
            verify={file.verify}
            img={img[key]}
            checkbox
            nav={() => this.props.footerAction(key, file.extension)} />));
   }

   documentPicker() {
      DocumentPicker.show({
         filetype: ["public.item"]
      }, (error: any, res: any) => {
         this.props.addFiles(res.uri, res.fileName);
      });
   }

   render() {
      const { footerAction, footerClose, files, isFetching, readFiles, readCertKeys, personalCert } = this.props;
      const { navigate, goBack } = this.props.navigation;

      let certificate, icon, filesView;
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

      let img = iconSelection(files, files.length); // какое расширение у файлов

      if (files.length) {
         filesView = <ScrollView refreshControl={
            <RefreshControl refreshing={isFetching}
               onRefresh={() => readFiles()}
            />}>
            <List>{this.showList(img)}</List>
         </ScrollView>;
      } else {
         filesView = <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_prompt}>[Добавьте файлы]</Text>
         </View>;
      }

      let footer, selectFiles = null;
      if (this.props.footer.arrButton.length) { // выбраны ли файлы
         footer = <FooterSign />;
         selectFiles = <Text style={{ fontSize: 17, height: 20, color: "grey", width: "70%" }}>
            выбрано файлов: {this.props.footer.arrButton.length} </Text>;
      } else {
         if (files.length) {
            selectFiles = <Text style={{ fontSize: 17, height: 20, color: "grey", width: "70%" }}>
               всего файлов: {files.length}</Text>;
         } else {
            selectFiles = null;
         }
      }
      return (
         <Container style={styles.container}>
            <Headers title="Подпись / Проверка" goBack={() => goBack()} />
            <View style={styles.sign_enc_view}>
               <Text style={styles.sign_enc_title}>Сертификат подписи</Text>
               <Button transparent onPress={() => { readCertKeys(); navigate("SelectPersonalСert"); }} style={styles.sign_enc_button}>
                  <Image style={styles.headerImage} source={icon} />
               </Button>
            </View>
            {certificate}
            <View style={styles.sign_enc_view}>
               <Text style={styles.sign_enc_title}>Файлы</Text>
               {selectFiles}
               <Button transparent style={styles.sign_enc_button} onPress={() => { this.documentPicker(); }}>
                  <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")} />
               </Button>
            </View>
            {filesView}
            {footer}
         </Container>
      );
   }

   componentDidMount() {
      if (this.props.footer.arrButton.length !== 0) { this.props.footerClose(); }
      if (this.props.files.length === 0) { this.props.readFiles(); }
   }
}